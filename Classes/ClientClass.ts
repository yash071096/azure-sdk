import * as mqtt from 'mqtt';
import { globalSettings } from '../System/System';

export class ClientClass{

  verbose: boolean;
  dataStore: Array<object> = new Array();
  url: string;
  port: number;
  client: any;
  subscribedTopics: Array<String> = new Array();
  connectTimerId: any;

  constructor(url?: string, port?: number){
    this.verbose = globalSettings.verbose;
    if (url){
      this.url = url;
    } else {
      this.url = globalSettings.url;
    }
    if (port){
      this.port = port;
    } else {
      this.port = globalSettings.port;
    }
  }

  async connect(): Promise<boolean>{
    var self = this;
    return new Promise(async (resolve, reject) => {
      self.client = await mqtt.connect(self.url);
        self.connectTimerId = setTimeout(() => {
          reject("TimeOut connecting to broker");
        }, 10000);
        self.client.on("connect",function(){
          clearTimeout(self.connectTimerId);
          if (self.verbose === true) {
            console.log("ClientClass is connected");
          }
          resolve(true);
        })
    });
  }

  end(){
    while (this.subscribedTopics.length > 0){
      this.unsubscribe(this.subscribedTopics.shift());
    }
    while (this.dataStore.length > 0) {
      this.dataStore.pop();
    }
    clearTimeout(this.connectTimerId);
    this.client.end();
  }

  async unsubscribe(topicSubscribed?: String){
    if (topicSubscribed === undefined){
      while (this.subscribedTopics.length > 0){
        await this.client.unsubscribe(this.subscribedTopics.pop());
      }
    } else {
      topicSubscribed = globalSettings.systemID + topicSubscribed;
      await this.client.unsubscribe(topicSubscribed);
    }
  }

  async subscribe(topicSubscribed: string) {
    var self = this;
    topicSubscribed = globalSettings.systemID + topicSubscribed;
    await this.client.subscribe(topicSubscribed, 0,
      function(qosMode: number) {
        if (qosMode < 0x80) {
          if (topicSubscribed.endsWith('#')) {
            topicSubscribed = topicSubscribed.split('#')[0];
          }
          self.subscribedTopics.push(topicSubscribed);
          self.client.on('message', function(topicReceived: string, message: string, packet: any){
            packet.timeStamp = Date.now();
            if (topicReceived.startsWith(topicSubscribed)){
              self.dataStore.push({'topic': topicReceived, 'message': message.toString(), 'packet': packet});
              if (self.verbose === true) {
                console.log("Client got msg for topic: " + topicReceived + " > " + message.toString() + " @" + packet.timeStamp);
              }
            }
          });
        } else {
        }
      }
    );
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getMessages(options?: any){
    var self = this;
    var timeOut = 5000;
    var silence = false;

    if(options){
      timeOut = options.timeOut;
      silence = options.silence;
    }

    return new Promise(async (resolve, reject) => {
      var cancelRequest = false;
      var timeOutId = setTimeout(() => {
        cancelRequest = true;
        if(silence){
          resolve(null);
        } else {
          reject("TimeOut connecting to broker");
        }
      }, timeOut);
      if (self.dataStore.length > 0){
        clearTimeout(timeOutId);
        resolve(self.dataStore.shift());
      } else {
        while ((self.dataStore.length === 0) && (cancelRequest === false)) {
          await this.sleep(500);
        }
        clearTimeout(timeOutId);
        resolve(self.dataStore.shift());
      }
    });
  }

  async publish(topic: string, msg: string){
    msg = msg.toUpperCase();
    topic = globalSettings.systemID + topic;
    if(this.client.connected === true && this.client.disconnecting === false) {
      await this.client.publish(topic, msg);
      if (this.verbose === true) {
        console.log("Published topic: " + topic + " > " + msg);
      }
    }
  }

}