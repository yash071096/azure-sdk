var connectionString = 'HostName=radiant-iot.azure-devices.net;DeviceId=MyNodeDevice;SharedAccessKey=HIIHZXi79YSY/1UJoR5oOt4kyyj5Y08IzEiWQ6/YGWo=';
 
// use factory function from AMQP-specific package
var clientFromConnectionString = require('azure-iot-device-amqp').clientFromConnectionString;
 
// AMQP-specific factory function returns Client object from core package
var client = clientFromConnectionString(connectionString);
 
// use Message object from core package
var Message = require('azure-iot-device').Message;


const globalSettings = {
    'url': 'http://localhost',
    'port': 1883,
    'verbose': false,
    'testData': false,
    'vectorFile': null,
    'systemID': '/1234567890',
    'topicScanner': '/scanner',
    'topicScannerId': '/scanner/id',
    'topicScannerTag': '/scanner/tag',
    'topicTag': '/tag',
};

console.log('before bluetooth class');

class Bluetooth {

    _states = [
      'startup',
      'reset',
      'power_on',
      'scanning'
    ]
    _current_state = this._states[0];
    _deviceId = null;
    _sink = null;
    isRunning = false;
    isVerbose = globalSettings.verbose;
  
    constructor() {};

    start() {
      var events = require('events');
      var self = this;
  
      events.EventEmitter.call(self);
      self.__proto__ = events.EventEmitter.prototype;
  
      var spawn = require('child_process').spawn;
  
      if (globalSettings.globalSettings.testData === false){
        self._sink = spawn('bluetoothctl', ['--monitor']);
      } else {
        // if we are testing, we use test data
        self._sink = spawn('cat', [globalSettings.globalSettings.vectorFile]);
      }
  
      console.log('inside class');
      this.isRunning = true;
  
      self._sink.stderr.on('data', function (data) {
        console.log(data.toString());
      })
  
      self._sink.stdout.on('data', function (data) {
        data = data.toString();
        data = data.split('\n');
        while (data.length > 0){
          var singleLine = data.shift();
          if (self.isVerbose === true){
            console.log(singleLine);
          }
          if (self.isRunning === false) {
            if (self._sink.connected === true){
              self._sink.stdin.write("exit\r");
            }
            self._sink.kill();
            data = [];
          }
          if (globalSettings.globalSettings.testData === false){
            switch (self._current_state){
              case 'startup': {
                self._sink.stdin.write("power off\r");
                self._current_state = self._states[1];
              }
              case 'reset': {
                if(singleLine.indexOf('succeeded') !== -1){
                  self._current_state = self._states[2];
                  self._sink.stdin.write("power on\r");
                }
                break;
              }
              case 'power_on': {
                if(singleLine.indexOf('succeeded') !== -1){
                  self._current_state = self._states[3];
                  self._sink.stdin.write("agent on\r");
                  self._sink.stdin.write("scan on\r");
                }
                break;
              }
              case 'scanning': {
                checkAgent(self, singleLine.toString());
                checkSignal(self, singleLine.toString());
              }
            }
          } else {
            // test mode
            checkAgent(self, singleLine.toString());
            checkSignal(self, singleLine.toString());
          }
        }
      });
  
      function checkSignal(self, data){
        var MAC;
        var RSSI;
        var txtLines = data.split('\n');
  
        while (txtLines.length > 0) {
          var txtLine = txtLines.shift().toString();
          if (txtLine.indexOf("RSSI") !== -1 ){
            txtLine = txtLine.split('\n');
            txtLine = txtLine[0];
            MAC = txtLine.substr(txtLine.indexOf("Device") + 7, 17);
            RSSI = txtLine.substr(txtLine.indexOf("RSSI") + 6);
            if (RSSI.indexOf('nil') == -1) {
              self.emit('DeviceSignalLevel', MAC, RSSI, self._deviceId );
            }
          }
        }
      }
  
      function checkAgent(self, data){
        var MAC;
        var txtLine = data;
  
        if (txtLine.indexOf("Controller") !== -1 ){
          MAC = txtLine.substr(txtLine.indexOf("Controller") + 11, 17);
          self.emit('DeviceMac', MAC);
          self._deviceId = MAC;
          self._isBluetoothReady = true;
        }
      }
    }
  
    end() {
      this.isRunning = false;
    }
}
  
console.log('after class');

this.bleSearch = new Bluetooth();

var connectCallback = function (err) {
  if (err) {
    console.error('Could not connect: ' + err);
  } else {
    console.log('Client connected');
    self.bleSearch.start();
    self.bleSearch.on('DeviceSignalLevel', function(mac, signal, device) {
        console.log('inside ble');
        const data = {'BLE_ID': mac, "RSSI": signal, "SCANNER_ID": device};
        console.log(data);
        return data;
    });
    var msg = new Message(txt);
    client.sendEvent(msg, function (err) {
      if (err) {
        console.log(err.toString());
      } else {
        console.log('Message sent',msg);
      };
    });
  };
};
 
 
client.open(connectCallback);