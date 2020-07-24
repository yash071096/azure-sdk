import { globalSettings } from '../System/System';
import * as broker  from 'mosca';

export class BrokerClass {

  server: any;
  settings: any;
  verbose: boolean;

  constructor(port?: number) {
    this.verbose = globalSettings.verbose;
    if (port === undefined){
    } else {
      this.start(port);
    }
  }

  setVerbose(verbose: boolean){
    this.verbose = verbose;
  }

  async start(port?: number){

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

    var promise = new Promise(async (resolve, reject) => {
      var self = this;

      self.server = await new broker.Server(this.settings);

      self.server.on('ready', function() {
        if (self.verbose){
          console.log("Broker is ready");
        }
        resolve();
      });
      self.server.on('clientConnected', function(arg: any) {
        if (self.verbose){
          console.log("new Client " + arg.id + " is connected");
        }
      });
      self.server.on('clientDisconnected', function(arg: any) {
        if (self.verbose){
          console.log("Client " + arg.id + " is disconnected");
        }
      });
      self.server.on('subscribed', function(topic: string, arg: any) {
        if (self.verbose){
          console.log("new Client " + arg.id + " subscribed for: " + topic);
        }
      });
      self.server.on('unsubscribed', function(topic: string, arg: any) {
        if (self.verbose){
          console.log("Client " + arg.id + " unsubscribed for: " + topic);
        }
      });

    });
    return promise;
  }

  end() {
    this.server.close();
    if (this.verbose){
      console.log("Broker is stopping");
    }
  }
}

