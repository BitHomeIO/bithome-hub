module.exports = {

  executeCapability: function (nodeId, capability, params) {
    sails.log.debug('ActionService executing nodeId:' + nodeId + ' capability:' + capability + ' params:' + JSON.stringify(params));

    var message = {
      topic: nodeId,
      payload: 'capability.' + capability + ' ' + params.join(' '),
      qos: 0, // 0, 1, or 2
      retain: false // or true
    };

    sails.mqtt.publish(message, function() { });
  }
};