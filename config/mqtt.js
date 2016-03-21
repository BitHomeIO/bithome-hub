module.exports.mqtt = {
  connection: 'moscaSettingsMongoDB',

  start: function (cb) {

    sails.mosca = require('mosca');

    sails.mqtt = new sails.mosca.Server(sails.config.connections[this.connection]);

    sails.mqtt.on('clientConnected', function (client) {
      sails.log.debug(client.id + " connected");
    });

    sails.mqtt.on('clientDisconnected', function (client) {
      sails.log.debug(client.id + " disconnected");
    });

    // fired when a message is received
    sails.mqtt.on('published', function (packet, client) {
      //console.log('Published', packet.payload);
      MessageService.handleMessage(sails.moment(), client, packet)
    });

    sails.mqtt.on('ready',
      function setup() {
        sails.log.info('Mosca server is up and running');

        if (cb) {
          cb();
        }
      }
    );
  }
};
