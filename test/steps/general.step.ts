const log = require('why-is-node-running')
import { binding, given, then, when, before, after} from 'cucumber-tsflow/dist';
import { expect } from 'chai';

import { BrokerClass } from '../../Classes/BrokerClass';
import { LocationService } from '../../Service/LocationService';
import { ScannerService } from '../../Service/ScannerService';
import { ClientClass } from '../../Classes/ClientClass';

var globalSettings = require('../../System/System');

@binding()
export class GeneralSteps {
  private url: string = '';
  private port: number = 1883;
  private server: any;
  private subscriber: any;
  private publisher: any;
  private scanner: any;
  private locationService: any;

  public delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  @before()
  public before(){
    this.locationService = null;
  }

  @after()
  public async after(){
    if(this.publisher){
      await this.publisher.end();
    }
    if(this.subscriber){
      await this.subscriber.end();
    }
    if(this.locationService){
      await this.locationService.end();
    }
    if(this.scanner){
      await this.scanner.end();
    }
    if(this.server){
      await this.server.end();
    }
    await this.delay(1000);
    globalSettings.globalSettings.testData = false;
    if (globalSettings.globalSettings.verbose === true) {
      // log();
    }
  }

  @given('System Id is {string}')
  public setSystemId(id: string) {
    globalSettings.globalSettings.systemID = id;
    return 'success';
  }

  @given('wait for {int} seconds')
  public async waitSeconds(seconds: number) {
    await this.delay(seconds * 1000);
    return 'success';
  }

  @given('verbose is {string}')
  public setVerbose(verbose: string) {
    if (verbose === 'false'){
      globalSettings.globalSettings.verbose = false;
    } else {
      globalSettings.globalSettings.verbose = true;
    }
    return 'success';
  }

  @given('the broker URL is {string}')
  public brokerURL(url: string) {
    this.url = url;
    return 'success';
  }

  @given('the broker port is {int}')
  public brokerPort(port: number) {
    this.port = port
    return 'success';
  }

  @given('the broker is up and running')
  public async brokerStart() {
    if (this.url.toString().indexOf('localhost') > 0){
      this.server = new BrokerClass();
      await this.server.start(this.port);
    }
    return 'success';
  }

  @given('use test vector {string}')
  public useTestVectors(file: string) {
    globalSettings.globalSettings.testData = true;
    globalSettings.globalSettings['vectorFile'] = file;
    return 'success';
  }

  @given('the location service is up and running')
  public async locationStart() {
    this.locationService = new LocationService();
    await this.locationService.start();
    return 'success';
  }

  @given('the scanner service starts')
  public async scannerStart() {
    if (this.scanner == null){
      this.scanner = new ScannerService();
    }
    await this.scanner.start(this.url, this.port);
    return 'success';
  }

  @given('stop scanner service')
  public async scannerStop() {
    await this.scanner.end();
    return 'success';
  }

  @given('the subscriber is listing for topic {string}')
  public async subscriberListen(topic: string) {
    if (this.subscriber == null){
      this.subscriber = new ClientClass(this.url, this.port);
      await this.subscriber.connect();
    }
    await this.subscriber.subscribe(topic);
    return 'success';
  }

  @when('the publisher sends {string} to topic {string}')
  public async publisherSend(msg: string, topic: string) {
    if (this.publisher == null){
      this.publisher = await new ClientClass(this.url, this.port);
      await this.publisher.connect();
    }
    await this.publisher.publish(topic, msg);
    return 'success';
  }

  @then('the subscriber for topic {string} receives {string}')
  public async subscriberReceives(topic: string, msg: string) {
    var messages = await this.subscriber.getMessages({timeOut: 15000, silence: true});
    console.log('rx msg');
    expect(messages.length, "expect to have received messages").to.be.above(0);
    if (messages.length > 0){
      var lastMsg = messages.pop();
      expect(lastMsg['topic'].toString(), "expect the correct topic").equal(topic);
      expect(lastMsg['message'].toString(), "expect the correct payload").equal(msg);
    }
    return;
  }

  @then('the subscriber for topic {string} receives something')
  public async subscriberReceivesSomething(topic: string) {
    var messages = await this.subscriber.getMessages({timeOut: 15000, silence: true});
    expect(messages.length, "expect to have received messages").to.be.above(0);
    return 'success';
  }

  @then('the subscriber for topic {string} receives nothing')
  public async subscriberReceivesNothing(topic: string) {
    var messages = await this.subscriber.getMessages({timeOut: 4000, silence: true});
    expect(messages, "expect to have received messages").to.be.null;
    return 'success';
  }

  @then('the subscriber for topic {string} receives JSON record')
  public async subscriberReceivesJsonData(topic: string) {
    var messages = await this.subscriber.getMessages({timeOut: 15000, silence: true});
    expect(messages, "expect to have received messages").to.not.be.undefined;
    expect(messages, 'expect the record to have the property "message" ').to.have.property('message');
    expect(messages['message'], 'expect the message to contain a "String"').to.be.string;
    const jsonRecord = JSON.parse(messages['message']);
    expect(jsonRecord, 'expect the message to contain a valid formatted json string').to.not.be.undefined;
  }

  @then('the subscriber for topic {string} receives {string}:{string} in JSON record')
  public async subscriberReceivesJsonRecord(topic: string, key: string, data: string) {
    var messages = await this.subscriber.getMessages({timeOut: 15000, silence: true});
    expect(messages.length, "expect to have received messages").to.be.above(0);
    expect(messages[0], 'expect the record to have the property "message" ').to.have.property('message');
    expect(messages[0].message, 'expect the message to contain a "String"').to.be.string;
    const jsonRecord = JSON.parse(messages[0].message);
    expect(jsonRecord, 'expect the message to contain a valid formatted json string').to.not.be.undefined;
    expect(jsonRecord[key]).to.be.equal(data);
  }

  @then("the subscriber for topic {string} doesn't receive {string}")
  public async subscriberNotReceives(topic: string, msg: string) {
    var messages = await this.subscriber.getMessages({timeout: 3000, silence: true});
    expect(messages.length, "Should get nothing back").equal(0);
    return ;
  }
}
