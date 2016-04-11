var https = require('https');
var querystring = require('querystring');

var machina = require('machina');
var logName = 'WioLinkBridge: ';

module.exports = {

  name: 'Wio Link Bridge',
  source: 'wio',
  searchNewNodesIntervalMs: 60000,
  wioLinkUrl: 'iot.seeed.cc',
  token: null,
  email: null,
  password: null,
  nodeIdWioIdMap: {},
  capabilitiesMap: {},

  signals: new machina.Fsm({
    namespace: 'wio-signal',
    initialState: 'uninitialized',
    states: {
      uninitialized: {
        "*": function () {
          this.deferUntilTransition();
          this.transition('login');
        }
      },
      login: {
        _onEnter: function () {
          this.emit("login");
        },
        'fetchNodes': function () {
          this.transition('fetchNodes');
        },
      },
      fetchNodes: {
        _onEnter: function () {
          this.emit("fetchNodes");
        },
        'readValues': function () {
          this.transition('readValues');
        },
      },
      initialized: {
        _onEnter: function () {
          this.timer = setTimeout(function () {
            this.handle('timeout');
          }.bind(this), 10000);
        },
        timeout: 'readValues',
        _onExit: function () {
          clearTimeout(this.timer);
        }
      },
      readValues: {
        _onEnter: function () {
          this.emit("readValues");
        },
        'initialized': function () {
          this.transition('initialized');
        },
      },
    }
  }),

  login: function login() {
    sails.log.debug(logName + "Logging into Wio Link");

    var that = this;

    var postData = querystring.stringify({
      email: that.email,
      password: that.password,
    });

    var options = {
      host: this.wioLinkUrl,
      path: '/v1/user/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    var req = https.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function(data) {
        if (res.statusCode === 200) {
          var dataJson = JSON.parse(data);
          sails.log.info(logName + "Successfully logged into Wio Link");
          that.token = dataJson.token;
          that.signals.handle('fetchNodes');
        } else {
          sails.log.error(logName + "Error logging into Wio Link: " + res.statusCode);
        }
      });
    });

    // post the data
    req.write(postData);
    req.end();
  },

  fetchNodes: function fetchNodes() {
    sails.log.debug(logName + "Fetching Wio Nodes");
    var that = this;

    var options = {
      host: this.wioLinkUrl,
      path: '/v1/nodes/list',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'token ' + that.token
      }
    };

    var req = https.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function(data) {
        if (res.statusCode === 200) {
          var result = JSON.parse(data);

          _.each(result.nodes, function (node) {
            sails.log.debug(logName + "Found node " + node.name + " (" + node.node_sn + ")");
            that.nodeIdWioIdMap[node.node_sn] = node.node_key;
            that.capabilitiesMap[node.node_sn] = [];
            NodeService.addNode(node.node_sn, node.name, that.source);

            that.getCapabilities(node.node_sn, node.node_key);
          });

          that.signals.handle('readValues');
        } else {
          sails.log.error(logName + "Error getting Wio Link nodes: " + res.statusCode);
        }
      });
    });

    req.end();
  },

  getCapabilities: function getCapabilities(nodeId, nodeKey) {
    sails.log.debug(logName + "Fetching capabilities for " + nodeId);
    var that = this;

    var options = {
      host: this.wioLinkUrl,
      path: '/v1/node/.well-known',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'token ' + nodeKey
      }
    };

    var req = https.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function(data) {
        if (res.statusCode === 200) {
          var result = JSON.parse(data);

          _.each(result.well_known, function (groveItem) {
            var capability = that.convertToCapability(groveItem);
            if (capability) {
              that.capabilitiesMap[nodeId].push(capability);
              NodeService.addNodeCapability(nodeId, capability);

              that.listenForEvents(nodeId, capability);
            }
          });

        } else {
          sails.log.error(logName + "Error getting Wio node capabilities: " + res.statusCode);
        }
      });
    });

    req.end();
  },

  convertToCapability: function convertToCapability(groveItem) {
    // sails.log(groveItem);
    if (groveItem.indexOf('GroveAirqualityA0') > -1) {
      return 'airQualityMeasurement';
    }
    if (groveItem.indexOf('GroveDigitalLightI2C0') > -1) {
      return 'illuminanceMeasurement';
    }
    if (groveItem.indexOf('GroveTempHumD0/humidity') > -1) {
      return 'relativeHumidityMeasurement';
    }
    if (groveItem.indexOf('GroveTempHumD0/temperature ') > -1) {
      return 'temperatureMeasurementC';
    }
    if (groveItem.indexOf('GroveTempHumD0/temperature_f') > -1) {
      return 'temperatureMeasurementF';
    }

    return null;
  },

  convertToGroveItem: function convertToGroveItem(capability) {
    switch (capability) {
      case 'airQualityMeasurement':
        return 'GroveAirqualityA0/quality';
      case 'illuminanceMeasurement':
        return 'GroveDigitalLightI2C0/lux';
      case 'relativeHumidityMeasurement':
        return 'GroveTempHumD0/humidity';
      case 'temperatureMeasurementC':
        return 'GroveTempHumD0/temperature';
      case 'temperatureMeasurementF':
        return 'GroveTempHumD0/temperature_f';
    }
    return null;
  },

  listenForEvents: function listenForEvents(nodeId, capability) {
    // hook up any events
  },

  readValues: function readValues() {
    var that = this;

    _.forEach(that.nodeIdWioIdMap, function(value, key) {
      _.forEach(that.capabilitiesMap[key], function(capability) {

        sails.log(logName + 'Reading capability ' + capability);
        that.readValue(key, value, capability);
      });
    });

    this.signals.handle('initialized');
  },

  readValue: function readValues(nodeId, nodeKey, capability) {
    var that = this;

    var groveItem = this.convertToGroveItem(capability);

    if (groveItem) {

      var options = {
        host: this.wioLinkUrl,
        path: '/v1/node/' + groveItem,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'token ' + nodeKey
        }
      };

      var req = https.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(data) {
          if (res.statusCode === 200) {
            var result = JSON.parse(data);
            var value = result[Object.keys(result)[0]];

            ActionService.updateValues(nodeId, capability, [value]);

          } else {
            sails.log.error(logName + "Error getting Wio capability value: " + groveItem + " " + res.statusCode);
          }
        });
      });

      req.end();
    }
  },

  init: function init() {
    sails.log.info(logName + ": Starting");
    var that = this;
    this.signals.on('login', function () {
      that.login();
    });
    this.signals.on('fetchNodes', function () {
      that.fetchNodes();
    });
    this.signals.on('readValues', function () {
      that.readValues();
    });
    this.signals.handle('init');

    MessageService.registerSource(that.source, that);
  },

  getStatus: function getStatus() {
    return this.signals.compositeState()
  }
};

