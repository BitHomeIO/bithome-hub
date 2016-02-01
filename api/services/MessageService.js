module.exports = {

  handleMessage: function(timestamp, client, packet) {

    if (!packet.topic.startsWith("$SYS/")) {
      sails.log.debug("["+timestamp.format() + "] " + client.id + " Topic:" + packet.topic + " Packet:" + packet.payload);
    }
  }
};