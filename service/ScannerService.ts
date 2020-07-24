
import { ClientClass } from '../Classes/ClientClass';
import { globalSettings } from '../System/System';
const { Bluetooth }  = require('../Classes/blueToothCtl');

export class ScannerService extends ClientClass {

  settings: any;
  verbose: boolean = false;
  heartBeatTimer: any;
  bleSearch: any;

  constructor(url?: string, port?: number) {
    super(url, port);
    this.verbose = globalSettings.verbose;
    if (url === undefined || port === undefined){
    } else {
      this.start(url, port);
      if(this.verbose === true) {
        console.log("Scanner is starting");
      }
    }
    this.bleSearch = new Bluetooth();
  }

  setVerbose(verbose: boolean){
    this.verbose = verbose;
  }

  async start(url?: string, port?: number){
    var self = this;
    if (port === undefined){
      this.settings = {
        port: globalSettings.port
      }
    } else {
      this.settings = {
        port: port
      };
    }
    if (url === undefined){
      this.settings = {
        url: globalSettings.url,
        port: this.settings.port
      }
    } else {
      this.settings = {
        url: url,
        port: port
      };
    }

    await super.connect().then(async function(status: any) {
      if (self.verbose === true) {
        console.log("scanner is connected");
      }
      await self.bleSearch.start();
      self.bleSearch.on('DeviceSignalLevel', function(mac: string, signal: number, device: string) {
        // console.log('signal level of: ' + mac + ' - ' + signal + ' < ' + device);
        const data = {'BLE_ID': mac, "RSSI": signal, "SCANNER_ID": device};
        if (self.client.connected === true && self.client.disconnecting === false){
          const topic = globalSettings.systemID + globalSettings.topicScannerTag;
          self.client.publish(topic, JSON.stringify(data)); //this data needs to be returned to the stimulated_device.js line 34
        }
      });
      self.bleSearch.on('DeviceMac', function(mac: string) {
        if (self.heartBeatTimer == undefined ) {
          const data: object = {"SCANNER_ID": mac};
          self.heartbeat(self, data);
          self.heartBeatTimer = setInterval(() => { self.heartbeat(self, data); }, 30000);
        }
      });
    });
  }

  heartbeat(self: any, data: any) {
    if (self.client.connected === true && self.client.disconnecting === false) {
      const topic = globalSettings.systemID + globalSettings.topicScannerId;
      self.client.publish(topic, JSON.stringify(data)); //this data also needs to be returned to simulated_device.js
    } else {
      clearInterval(self.heartBeatTimer);
    }
  }

  end() {
    if (this.verbose){
      console.log("Scanner is stopping");
    }
    clearInterval(this.heartBeatTimer);
    this.bleSearch.isRunning = false;
    super.end();
  }
}


