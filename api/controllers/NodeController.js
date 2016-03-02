/**
 * NodeController
 *
 * @description :: Server-side logic for managing nodes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  get: function (req, res) {
    // Make sure this is a socket request (not traditional HTTP)
    if (!req.isSocket) {return res.badRequest();}
    // Have the socket which made the request join the "messages" room
    sails.sockets.join(req.socket, 'node', function() {
      NodeService.query(20, 0, function(messages) {
        return res.json(messages);
      });
    });
  },
};

