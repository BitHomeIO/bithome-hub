module.exports = {

  hubTopic: 'hub',
  sourceMap: {},

  /**
   * Initialize the Message Service
   */
  init: function() {

  },

  /**
   * Register a node source with its handler method
   */
  registerSource: function (key, handler) {
    this.sourceMap[key] = handler;
  },

  /**
   * Incoming message handler
   */
  handleMessage: function (timestamp, client, packet) {

    if (!packet.topic.startsWith("$SYS/")) {

      // sails.log.debug(JSON.stringify(NodeService.nodeSourceMap));
      // Check to see if this message has come across the hub topic
      if (packet.topic === this.hubTopic) {
        MessageService.handleMessageForHub(timestamp, client, packet);
      } else if(NodeService.nodeSourceMap[packet.topic]) {
        // Otherwise assume this message is for a device
        MessageService.handleMessageForNode(packet.topic, timestamp, client, packet);
      } else {
        sails.log.debug("[" + timestamp.format() + "]  Packet:" + JSON.stringify(packet));
      }
    }
  },

  /**
   * Handle messages directed at the hub
   */
  handleMessageForHub: function (timestamp, client, packet) {

    MessageService.saveMessage(timestamp, client.id, packet.topic, packet.payload);

    // Check for the existence of this node
    NodeService.getNode(client.id,
      function (node) {
        if (!node) {
          // New node so save it
          NodeService.addNode(client.id, null, 'mqtt');
        } else {
          sails.log('Message from nodeId: ' + client.id + ' ' + packet.payload);
        }
      }
    );
  },

  /**
   * Handle messages directed at a device on a bridged source
   */
  handleMessageForNode: function (nodeId, timestamp, client, packet) {

    // sails.log.debug('Device message for nodeId: ' + nodeId + ' ' + packet.payload);

    // Lookup the bridge for this source and pass it along
    var source = NodeService.nodeSourceMap[nodeId];

    if (source) {
      var callbackBridge = MessageService.sourceMap[source];

      if (callbackBridge && callbackBridge.handleMessage) {
        callbackBridge.handleMessage(nodeId, packet.payload);
      } else {
        sails.log.error('No callback for source:' + source);
      }
    } else {
      sails.log.error('No source for nodeId:' + nodeId);
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