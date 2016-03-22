var hue = require("node-hue-api");
var HueApi = hue.HueApi;
var LightState = hue.lightState;

var machina = require('machina');
var logName = 'HueAdapter: ';

module.exports = {

  name: 'Hue Adapter',
  logName: 'HueAdapter: ',
  source: 'hue',
  linkButtonIntervalMs: 5000,
  searchNewNodesIntervalMs: 60000,
  hueBridge: null,
  hueApi: null,
  capabilities: [
    'alarm',
    'colorControlHsb',
    'colorControlRgb',
    'colorTemperature',
    'switch',
    'switchLevel'
  ],

  nodeIdHueIdMap: {},

  signals: new machina.Fsm({
    namespace: 'hue-signal',
    initialState: 'uninitialized',
    states: {
      uninitialized: {
        "*": function () {
          this.deferUntilTransition();
          this.transition('searchBridges');
        }
      },
      searchBridges: {
        _onEnter: function () {
          this.emit("searchBridges");
        },
        'bridgeNotFound': function () {
          this.transition('bridgeNotFound');
        },
        'initializeBridge': function () {
          this.transition('initializeBridge');
        }
      },
      initializeBridge: {
        _onEnter: function () {
          this.emit("initializeBridge");
        },
        'waitingForLinkButton': function () {
          this.transition('waitingForLinkButton');
        },
        'fetchingLights': function () {
          this.transition('fetchingLights');
        }
      },
      waitingForLinkButton: {
        _onEnter: function () {
          this.timer = setTimeout(function () {
            this.handle('timeout');
          }.bind(this), 5000);
        },
        timeout: 'initializeBridge',
        _onExit: function () {
          clearTimeout(this.timer);
        }
      },
      fetchingLights: {
        _onEnter: function () {
          this.emit("fetchingLights");
        }
      },
      initialized: {
        _onEnter: function () {
          this.timer = setTimeout(function () {
            this.handle('timeout');
          }.bind(this), 60000);
        },
        timeout: 'fetchingLights',
        _onExit: function () {
          clearTimeout(this.timer);
        }
      },
      bridgeNotFound: {
        _onEnter: function () {
        }
      }
    }
  }),

  connectWithKey: function connectWithKey(key) {
    sails.log.debug(this.logName + "Connecting with credentials");

    this.hueApi = new HueApi(this.hueBridge.ipaddress, key);

    var that = this;

    that.hueApi.description(function (err, result) {
      if (err) {
        sails.log.error(that.logName + "Error getting bridge description: " + err);
      } else {
        sails.log.debug(that.logName + "Connected to " + result.model.name);
        that.signals.handle('fetchingLights');
      }
    });
  },

  registerWithBridge: function registerWithBridge() {
    sails.log.debug(this.logName + "Registering with hue bridge");

    var hueApi = new HueApi();
    var that = this;

    hueApi.createUser(that.hueBridge.ipaddress, function (err, key) {
      if (err) {
        sails.log.error(that.logName + "Error registering with bridge:" + err);
        that.signals.handle('waitingForLinkButton');
      } else {
        console.log(that.logName + "Key received from bridge");

        BridgeSetting.create({
          bridgeId: that.logName,
          key: 'userId',
          value: key
        }).exec(function (error, created) {
          if (!error) {
            sails.log.info(that.logName + "Saved key")
            that.connectWithKey(key);
          } else {
            sails.log.error(that.logName + error);
          }
        });
      }
    });
  },

  initializeBridge: function initializeBridge() {
    var that = this;
    sails.log.debug(that.logName + "Initializing bridge");

    var that = this;
    BridgeSetting.findOne({bridgeId: that.logName, key: 'userId'}).exec(
      function (err, record) {
        if (record) {
          that.connectWithKey(record.value);

        } else {
          that.registerWithBridge();
        }
      });
  },


  searchBridges: function searchBridges() {
    sails.log.debug(this.logName + "Searching for hue bridges");
    var that = this;
    hue.nupnpSearch(function (err, result) {
      if (err) {
        sails.log.error(that.logName + "Error searching for bridges:" + err);
        that.signals.handle('bridgeNotFound');
      } else {
        if (result.length === 0) {
          sails.log.debug(that.logName + "No Hue bridges Found.");
          that.signals.handle('bridgeNotFound');
        } else {
          var bridge = result[0];
          sails.log.debug(that.logName + "Bridge found: " + JSON.stringify(bridge));
          that.hueBridge = bridge;
          that.signals.handle('initializeBridge');
        }
      }
    });
  },

  fetchingLights: function fetchingLights() {
    sails.log.debug(this.logName + "Fetching lights");
    var that = this;
    that.hueApi.lights(function (err, result) {
      if (err) {
        sails.log.error(that.logName + "Error fetching lights from bridge:" + err);
        that.signals.handle('bridgeNotFound');
      } else {
        if (result.lights.length === 0) {
          sails.log.debug(that.logName + "No Hue lights Found.");
          that.signals.handle('bridgeNotFound');
        } else {
          _.each(result.lights, function (light) {
            sails.log.debug(that.logName + "Found light " + light.name + " (" + light.uniqueid + ")");
            that.nodeIdHueIdMap[light.uniqueid] = light.id;
            NodeService.addNode(light.uniqueid, light.name, that.source);
            NodeService.addNodeCapabilities(light.uniqueid, that.capabilities);
          });
        }
      }
    });
  },

  handleMessage: function handleMessage(nodeId, message) {
    if (!message || message.length == 0) {
      sails.log.warn(this.logName + 'null message');
    }

    sails.log.debug(this.logName + 'handling message nodeId:' + nodeId + ' message:' + message);

    var hueId = this.nodeIdHueIdMap[nodeId];

    if (hueId) {

      var args = message.toString().split(' ');

      switch (args[0]) {
        case 'capability.switch':
          if (this.requireArgs(args, 2)) {
            if (args[1] == 'on') {
              this.switchLight(hueId, true);
            } if (args[1] == 'off') {
              this.switchLight(hueId, false);
            }
          }
          break;
        case 'capability.switch.on':
          this.switchLight(hueId, true);
          break;
        case 'capability.switch.off':
          this.switchLight(hueId, false);
          break;
        case 'capability.switch.alert.off':
          this.switchLight(hueId, false);
          break;
        case 'capability.switchLevel':
        case 'capability.switchLevel.setLevel':
          if (this.requireArgs(args, 2)) {
            // Scale this up to 0-255
            this.setBrightness(hueId, 2.55 * args[1]);
          }
          break;
        case 'capability.alarm':
          if (this.requireArgs(args, 2)) {
            if (args[1] == 'strobe' || args[1] == 'both') {
              this.alertLight(hueId);
            }
          }
          break;
        case 'capability.alarm.strobe':
        case 'capability.alarm.both':
          this.alertLight(hueId);
          break;
        case 'capability.colorControlHsb':
          if (this.requireArgs(args, 4)) {
            this.hueApi.setLightState(hueId, LightState.create().on().hsb(3.59*args[1], args[2], args[3])).done();
          }
          break;

        case 'capability.colorControlHsb.setHue':
          if (this.requireArgs(args, 2)) {
            this.hueApi.setLightState(hueId, LightState.create().on().hue(args[1])).done();
          }
          break;

        case 'capability.colorControlHsb.setSaturation':
          if (this.requireArgs(args, 2)) {
            this.hueApi.setLightState(hueId, LightState.create().on().sat(args[1])).done();
          }
          break;

        case 'capability.colorControlHsb.setBrightness':
          if (this.requireArgs(args, 2)) {
            this.setBrightness(hueId, args[1]);
          }
          break;

        case 'capability.colorControlRgb':
          if (this.requireArgs(args, 4)) {
            this.setRgb(hueId, args[1], args[2], args[3]);
          }
          break;

        case 'capability.colorTemperature':
          if (this.requireArgs(args, 2)) {
            var temperature = args[1]*(500.0-153.0)/100.0 + 153.0 ;
            this.hueApi.setLightState(hueId, LightState.create().on().colorTemp(temperature)).done();
          }
          break;

        default:
          sails.log.info(this.logName + 'capability ' + args[0] + ' not implemented');
          break;
      }
      //if (message == 'on') {
      //  state = LightState.create().on();
      //} else if (message == 'off') {
      //  state = LightState.create().off();
      //} else if (message == 'alert') {
      //  state = LightState.create().longAlert();
      //} else if (message == 'color') {
      //  state = LightState.create().colorLoop();
      //} else {
      //  sails.log.error(this.logName + 'unknown state: ' + message);
      //}
      //
      //this.hueApi.setLightState(hueId, state).done();

    } else {
      sails.log.error(this.logName + 'no Hue ID for nodeId: ' + nodeId);
    }
  },

  requireArgs: function(args, minLength) {
    if (args.length < minLength) {
      sails.log.error(this.logName + 'invalid arguments');
      return false;
    }
    return true;
  },

  setRgb: function(hueId, red, green, blue) {
    var state = LightState.create().on().rgb(red, green, blue);

    this.hueApi.setLightState(hueId, state).done();
  },

  setBrightness: function(hueId, brightness) {
    var state = LightState.create().on().bri(brightness);

    this.hueApi.setLightState(hueId, state).done();
  },

  /**
   * Strobe the light
   */
  alertLight: function(hueId) {

    var state = LightState.create().longAlert();

    this.hueApi.setLightState(hueId, state).done();
  },

  /**
   * Switch the light on or off
   */
  switchLight: function(hueId, isOn) {

    var state;
    if (isOn == true) {
      state = LightState.create().on();
    }
    if (isOn == false) {
      state = LightState.create().off();
    }
    if (state) {
      this.hueApi.setLightState(hueId, state).done();
    }
  },

  init: function init() {
    sails.log.info(this.logName + ": Starting");
    var that = this;
    this.signals.on('searchBridges', function () {
      that.searchBridges();
    });
    this.signals.on('initializeBridge', function () {
      that.initializeBridge();
    });
    this.signals.on('fetchingLights', function () {
      that.fetchingLights();
    });
    this.signals.handle('init');

    MessageService.registerSource(that.source, that);
  },

  getStatus: function getStatus() {
    return this.signals.compositeState()
  }
};

