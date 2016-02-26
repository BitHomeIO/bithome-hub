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
    MessageService.query(20, 0, function(messages) {
      return res.json(messages);
    });
  },

  //stream: function(req, res) {
  //  // Make sure this is a socket request (not traditional HTTP)
  //  if (!req.isSocket) {return res.badRequest();}
  //  // Have the socket which made the request join the "messages" room
  //  sails.sockets.join(req, 'messages');
  //  // Broadcast a "hello" message to all the fun sockets.
  //  // This message will be sent to all sockets in the "funSockets" room,
  //  // but will be ignored by any client sockets that are not listening-- i.e. that didn't call `io.socket.on('hello', ...)`
  //  sails.sockets.broadcast('messages', 'hello', req);
  //  // Respond to the request with an a-ok message
  //  return res.ok();
  //},

  /**
   * `MessageController.clear()`
   */
  clear: function (req, res) {
    MessageService.clear();
    return res.ok();
  }
};

