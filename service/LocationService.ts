import { scannerConfiguration } from '../test/vectors/db.txt';
import { scannerSchema, tagDataSchema, coordinatesSchema, configurationDataSchema } from '../Classes/location';
import { ClientClass } from '../Classes/ClientClass';
import { globalSettings } from '../System/System';

export class LocationService extends ClientClass{

  isRunning: boolean = false;
  verbose: boolean = globalSettings.verbose;

  dataBase: scannerSchema = {};
  configuration: configurationDataSchema = {};

  constructor(url?: string, port?: number) {
    super(url, port);
    this.configuration = scannerConfiguration;
  }

  async start() {
    var self = this;
    this.isRunning = true;
    super.connect().then(async function(status: any){
      if (self.verbose){
        console.log("Location is starting");
      }
      await self.subscribe(globalSettings.topicScannerTag);
      while (self.isRunning) {
        await self.getMessages().then(function(msg: any){
          self.handleScannerDiscoverMessage(self, JSON.parse(msg.message))
        }).catch(function(err: any){
        })
      }
    })
  }

  handleScannerDiscoverMessage(self: any, msg: any){
    var scannerID;
    var bleId;

    if(('SCANNER_ID' in msg)){
      scannerID = msg.SCANNER_ID;
      if(!(scannerID in self.dataBase)){
        self.dataBase[scannerID] = {};
        if (self.verbose) {
          console.log('found new scanner');
        }
      }
    } else {
      return;
    }

    if(('BLE_ID' in msg)) {
      const scannerData = self.dataBase[scannerID];
      bleId = msg.BLE_ID;
      if(!(bleId in scannerData)){
        self.dataBase[scannerID][bleId] = {}
        if (self.verbose) {
          console.log('found new tag');
        }
      } else {
        if (self.verbose) {
          console.log('Update tag: ' + bleId);
        }
      }

      self.dataBase[scannerID][bleId] = {
        'rssi': msg.RSSI,
        'timeStamp' : Date.now()
      }

      self.calculateLocation(bleId);
    }
  }

  checkIfExpired(timeStamp: number): boolean{
    const deltaTime = Date.now() - timeStamp;
    return false;
  }

  triangulate(tagData: tagDataSchema, tagId: string): coordinatesSchema {
    const validOfScanners: Array<string> = Object.keys(tagData[tagId]);
    var lat: number = 0;
    var long: number = 0;
    if (validOfScanners.length === 1) {
      lat = tagData[tagId][validOfScanners[0]].coordinates.lat;
      long = tagData[tagId][validOfScanners[0]].coordinates.long;
    }
    if (validOfScanners.length === 2) {
      const distanceLat = tagData[tagId][validOfScanners[0]].coordinates.lat - tagData[tagId][validOfScanners[1]].coordinates.lat;
      const distanceLong = tagData[tagId][validOfScanners[0]].coordinates.long - tagData[tagId][validOfScanners[1]].coordinates.long;
      const rssiRatio = (Number(tagData[tagId][validOfScanners[0]].rssi) / Number(tagData[tagId][validOfScanners[1]].rssi)) / 2;
      lat = tagData[tagId][validOfScanners[0]].coordinates.lat - (distanceLat * rssiRatio);
      long = tagData[tagId][validOfScanners[0]].coordinates.long - (distanceLong * rssiRatio);
    }

    return {'lat': lat, 'long': long}
  }

  calculateLocation(tagId: string){
    var numberOfScannersContainingTag = 0;
    var tagData: tagDataSchema = {};
    for(var key in this.dataBase) {
      if (this.dataBase.hasOwnProperty(key)) {
        if (this.dataBase[key].hasOwnProperty(tagId)) {
          if (numberOfScannersContainingTag === 0) {
            tagData[tagId] = { };
          }
          if (!this.checkIfExpired(this.dataBase[key][tagId].timeStamp)) {
            numberOfScannersContainingTag ++;
            tagData[tagId][key] = {
                'rssi': this.dataBase[key][tagId].rssi,
                'timeStamp': this.dataBase[key][tagId].timeStamp,
                'coordinates': this.configuration[key]
            };
          } else {
            // remove scanner data from tag as its data is too old
            delete this.dataBase[key][tagId];
          }
        }
      }
    }

    var update = {
      'timeStamp': Date.now(),
      'location': this.triangulate(tagData, tagId),
      'quality': numberOfScannersContainingTag
    }
    super.publish(globalSettings.topicTag + '/' + tagId, JSON.stringify(update))
  }

  end() {
    if (this.verbose){
      console.log("Location is stopping");
    }
    this.isRunning = false;
    this.unsubscribe();
    super.end();
  }

}