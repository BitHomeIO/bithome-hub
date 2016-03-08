module.exports = {
	
  get: function (req, res) {
    var bridges = [];
      _.each(
      BridgeService.bridges,
      function(bridge) {
        bridges.push({ name: bridge.name,
                       id: bridge.logName,
                       status: bridge.getStatus()});
      }
    );

    return res.json(bridges);
  }
};

