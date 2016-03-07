module.exports = {
	
  get: function (req, res) {
    return res.json(BridgeService.bridges);
  }

};

