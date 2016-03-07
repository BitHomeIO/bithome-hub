var hue = require("node-hue-api");

module.exports = {

  name: 'Hue Adapter',
  logName: 'HueAdapter: ',
  timeoutBridgeSearch: 5000,

  displayBridges: function displayBridges(bridges) {
    if (bridges.length === 0) {
      sails.log.debug(this.logName + "No Hue bridges Found.");

    } else {
      _.each(bridges,
        function(bridge) {
          sails.log.debug(this.logName + "Bridge found: " + JSON.stringify(bridge));
        }
      );
    }
  },

  searchForBridges: function searchForBridges() {
    sails.log.debug(this.logName + "Searching for hue bridges");
    var that = this;
    hue.nupnpSearch(function (err, result) {
      if (err) {
        sails.log.error(that.logName + "Error searching for bridges:" + err);
      } else {
        that.displayBridges(result);
      }
    });
  },

  init: function () {
    sails.log.info(this.logName + ": Starting");

    this.searchForBridges();
  }

};

