var hue = require("node-hue-api");
var HueApi = require("node-hue-api").HueApi;
var machina = require('machina');

module.exports = {

  name: 'Hue Adapter',
  logName: 'HueAdapter: ',
  linkButtonIntervalMs: 5000,
  searchNewNodesIntervalMs: 60000,
  hueBridge: null,

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
        }
      },
      waitingForLinkButton: {
        _onEnter: function() {
          this.timer = setTimeout( function() {
            this.handle( 'timeout' );
          }.bind( this ), 5000 );
        },
        timeout: 'initializeBridge',
        _onExit: function() {
          clearTimeout( this.timer );
        }
      },
      bridgeNotFound: {
        _onEnter: function () {
        }
      }
    }
  }),

  initializeBridge: function initializeBridge() {
    sails.log.debug(this.logName + "Registering with hue bridge");
    var that = this;

    BridgeSetting.findOne({bridgeId: that.logName, key: 'userId'}).exec(
      function (err, record) {
        if (record) {
          console.log('key:' + record.value);
        }
    });


    var hueApi = new HueApi();

    hueApi.createUser(that.hueBridge.ipaddress, function(err, user) {
      if (err) {
        sails.log.error(that.logName + "Error registering with bridge:" + err);
        that.signals.handle('waitingForLinkButton');
      } else {
        BridgeSetting.create ({
          bridgeId: that.logName,
          key: 'userId',
          value: user
        }).exec(function (error, created) {
          sails.log.info(that.logName + "Saved key")
        });
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

  init: function () {
    sails.log.info(this.logName + ": Starting");
    var that = this;
    this.signals.on('searchBridges', function() { that.searchBridges(); });
    this.signals.on('initializeBridge', function() { that.initializeBridge(); });
    this.signals.handle('init');
  },

  getStatus: function getStatus() {
    return this.signals.compositeState()
  }
};

