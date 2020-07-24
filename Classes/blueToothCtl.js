const globalSettings = require('../System/System');

export class Bluetooth {

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
  isVerbose = globalSettings.globalSettings.verbose;

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

