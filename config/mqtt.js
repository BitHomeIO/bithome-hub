module.exports.mqtt = {
  start: function (cb) {

    sails.mosca = require('mosca');

    var server = new sails.mosca.Server(sails.config.connections.moscaSettings);

    server.on('clientConnected', function (client) {
      sails.log.debug(client.id + " connected");
    });

    server.on('clientDisconnected', function (client) {
      sails.log.debug(client.id + " disconnected");
    });

    // fired when a message is received
    server.on('published', function (packet, client) {
      //console.log('Published', packet.payload);
      MessageService.handleMessage(sails.moment(), client, packet)
    });

    server.on('ready',
      function setup() {
        sails.log.info('Mosca server is up and running');

        if (cb) {
          cb();
        }
      }
    );
  }
};
