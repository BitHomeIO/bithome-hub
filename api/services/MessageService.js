module.exports = {

  /**
   * Incoming message handler
   *
   * @param timestamp
   * @param client
   * @param packet
   */
  handleMessage: function (timestamp, client, packet) {

    if (!packet.topic.startsWith("$SYS/")) {
      sails.log.debug("[" + timestamp.format() + "] " + client.id + " Topic:" + packet.topic + " Packet:" + packet.payload);

      MessageService.saveMessage(timestamp, client.id, packet.topic, packet.payload);

      // Check for the existance of this node
      NodeService.getNode(client.id,
        function (node) {
          if (!node) {
            // New node so save it
            NodeService.saveNode(client.id);
          } else {
            sails.log('Found node with nodeId: ' + client.id);
          }
       });
    }
  },

  /**
   * Save a message to the log
   *
   * @param timestamp
   * @param clientId
   * @param topic
   * @param payload
   */
  saveMessage: function (timestamp, clientId, topic, payload) {
    Message.create(
      {
        topic: topic,
        nodeId: clientId,
        message: payload,
        createdAt: timestamp.toDate()
      }).exec(
      function callback(error, created) {
        if (error) {
          sails.log.error(error);
        } else {
          sails.sockets.broadcast('message', 'message_created', created);

          sails.log.debug("[" + timestamp.format() + "] message saved");
        }
      }
    );
  },

  /**
   * Query the message log
   *
   * @param limit
   * @param offset
   * @returns {*}
   */
  query: function (limit, offset, cb) {
    Message.find({skip: offset, limit: limit}).sort({createdAt:-1}).exec(
      function(err, results) {
        if (!err) {
          return cb(results);
        }
      }
    );
  },

  /**
   * Clear out the message log
   */
  clear: function() {
    Message.drop();
  }
};