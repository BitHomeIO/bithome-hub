module.exports = {

  handleMessage: function (timestamp, client, packet) {

    if (!packet.topic.startsWith("$SYS/")) {
      sails.log.debug("[" + timestamp.format() + "] " + client.id + " Topic:" + packet.topic + " Packet:" + packet.payload);

      MessageService.saveMessage(timestamp, client.id, packet.topic, packet.payload);
    }
  },

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

  query: function (limit, offset) {
    return Message.find({skip: offset, limit: limit});
  }
};