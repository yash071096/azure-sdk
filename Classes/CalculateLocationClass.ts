import { testVector, scannerConfiguration } from '../test/vectors/db.txt';
import { scannerSchema, tagDataSchema, coordinatesSchema, configurationDataSchema } from '../Classes/location';

class test {

  dataBase: scannerSchema = {};
  configuration: configurationDataSchema = {};

  constructor() {
    this.dataBase = testVector;
    this.configuration = scannerConfiguration;
  }

  checkIfNotExpired(timeStamp: number): boolean{
    const deltaTime = Date.now() - timeStamp;
    if( deltaTime > 10000) { // 10 seconds
      return true;
    } else {
      return false;
    }
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
          if (this.checkIfNotExpired(this.dataBase[key][tagId].timeStamp)) {
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
    console.log('/tag/' + tagId + ":" + JSON.stringify(update))
  }

}

var dut: test = new test();
dut.calculateLocation('7A:DC:A5:54:68:8A');