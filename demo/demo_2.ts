const log = require('why-is-node-running')

import { BrokerClass } from '../Classes/BrokerClass';
import { LocationService } from '../Service/LocationService';
import { ScannerService } from '../Service/ScannerService';
import { globalSettings } from '../System/System';

globalSettings.url = 'http://broker.mqttdashboard.com';
//globalSettings.url = 'http://localhost';
globalSettings.port = 1883;
globalSettings.verbose = true;
globalSettings.testData = false;

async function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

const broker = new BrokerClass();
broker.start();

const locateService = new LocationService();
locateService.start();

const scannerService = new ScannerService();
scannerService.start();
