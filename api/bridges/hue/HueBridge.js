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
          });
        }
      }
    });
  },

  handleMessage: function handleMessage(nodeId, message) {
    sails.log.debug(this.logName + 'handling message for ' + nodeId);

    var hueId = this.nodeIdHueIdMap[nodeId];

    if (hueId) {
      var state;
      if (message == 'on') {
        state = LightState.create().on();
      } else if (message == 'off') {
        state = LightState.create().off();
      } else if (message == 'alert') {
        state = LightState.create().shortAlert();
      } else if (message == 'color') {
        state = LightState.create().colorLoop();
      } else {
        sails.log.error(this.logName + 'unknown state: ' + message);
      }

      this.hueApi.setLightState(hueId, state).done();

    } else {
      sails.log.error(this.logName + 'no Hue ID for nodeId: ' + nodeId);
    }
  },

  init: function () {
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

