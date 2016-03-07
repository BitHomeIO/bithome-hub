module.exports = {

  bridges: {},

  initBridge: function (key, bridge) {
    bridge.init();

    var keyName = key.replace(' ', '');

    this.bridges[keyName] = bridge;
  },

  init: function () {
    var available = sails.config.bridges.available;
    sails.log.info("BridgeService initialization. Starting " + available.length + " bridges;");

    async.each(available,
      function (bridgeEntry, callback) {


        var bridgeKey = Object.keys(bridgeEntry)[0];
        var bridge = bridgeEntry[bridgeKey];

        if (!bridge.name) {
          callback('Bridge: has no name field');
          return;
        }

        var name = bridge.name;

        sails.log.info('Initializing bridge: ' + name);

        if (bridge.init) {
          BridgeService.initBridge(bridgeKey, bridge);
        } else {
          callback('Bridge: ' + name + ' has no init method');
          return;
        }
      }, function (err) {
        sails.log.error("Error loading bridge: " + err);
      });
  }
};