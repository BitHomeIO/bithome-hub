module.exports = {

  postCapability: function (req, res) {

    ActionService.executeCapability(
      req.params['nodeId'],
      req.params['capability'],
      req.body['params']
    );


    return res.ok();
  },

  getValueUpdates: function (req, res) {
    var nodeId = req.params['nodeId'];

    // Make sure this is a socket request (not traditional HTTP)
    if (!req.isSocket) {return res.badRequest();}
    // Have the socket which made the request join the "messages" room
    sails.sockets.join(req.socket, nodeId, function() {
      return res.ok();
    });
  },

  stopValueUpdates: function (req, res) {
    var nodeId = req.params['nodeId'];

    // Make sure this is a socket request (not traditional HTTP)
    if (!req.isSocket) {return res.badRequest();}
    // Have the socket which made the request join the "messages" room
    sails.sockets.leave(req.socket, nodeId, function() {
      return res.ok();
    });
  },
};

