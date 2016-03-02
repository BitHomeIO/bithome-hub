/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
  /**
   * `MessageController.get()`
   */
  get: function (req, res) {
    // Make sure this is a socket request (not traditional HTTP)
    if (!req.isSocket) {return res.badRequest();}
    // Have the socket which made the request join the "messages" room
    sails.sockets.join(req.socket, 'message', function() {
      MessageService.query(20, 0, function(messages) {
        return res.json(messages);
      });
    });
  },

  /**
   * `MessageController.clear()`
   */
  clear: function (req, res) {
    MessageService.clear();
    return res.ok();
  }
};

