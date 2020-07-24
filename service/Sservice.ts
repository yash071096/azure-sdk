const { Bluetooth }  = require('../Classes/blueToothCtl');

export class Sservice {
    settings: any;
    verbose: boolean = false;
    heartBeatTimer: any;
    bleSearch: any;

    settings: any;
    verbose: boolean = false;
    heartBeatTimer: any;
    bleSearch: any;

    async start() {
        
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