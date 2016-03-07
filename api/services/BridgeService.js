module.exports = {

  bridges: {},

  initBridge: function (bridge) {
    bridge.init();

    var keyName = bridge.name.replace(' ', '');

    this.bridges[keyName] = bridge;

  },

  init: function () {
    var available = sails.config.bridges.available;
    sails.log.info("BridgeService initialization. Starting " + available.length + " bridges;");

    async.each(available,
      function (bridge, callback) {

        if (!bridge.name) {
          callback('Bridge: has no name field');
        }

        var name = bridge.name;

        sails.log.info('Initializing bridge: ' + name);

        if (bridge.init) {
          BridgeService.initBridge(bridge);
        } else {
          callback('Bridge: ' + name + ' has no init method');
        }
      }, function (err) {
        sails.log.error("Error loading bridge: " + err);
      });
  }
};