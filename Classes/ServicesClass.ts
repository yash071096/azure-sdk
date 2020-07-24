const mqtt = require('mqtt');
import { globalSettings } from '../System/System';

export class ServicesClass {

  verbose: boolean = false;
  userStoryClass: any = null;
  serverURL: string = '';
  serverPort: number = 1883;
  private userStoryName: string = '';

  constructor (userStory: string, arg: any) {
    this.verbose = globalSettings.verbose;
    if (arg){
      this.serverURL = arg.url;
      this.serverPort = arg.port;
    } else {
      this.serverURL = globalSettings.url;
      this.serverPort = globalSettings.port;
    }
    if (userStory){
      this.userStoryName = userStory;
    }
  }

  startUserStory(){
    this.userStoryClass.start();
  }

  end(){
    this.userStoryClass.end();
    this.userStoryClass = null;
  }
}