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
        clientId: clientId,
        message: payload,
        createdAt: timestamp.toDate(),
        updatedAt: timestamp.toDate()
      }).exec(
      function callback(error, created) {
        if (error) {
          sails.log.error(error);
        } else {
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
    Message.find({skip: offset, limit: limit}).exec(
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