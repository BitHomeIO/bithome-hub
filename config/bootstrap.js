/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  sails.moment = require('moment');
  sails.mosca = require('mosca');

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();

  var server = new sails.mosca.Server(sails.config.connections.moscaSettings);

  server.on('clientConnected', function(client) {
    sails.log.debug(client.id + " connected");
  });

  server.on('clientDisconnected', function(client) {
    sails.log.debug(client.id + " disconnected");
  });

  // fired when a message is received
  server.on('published', function(packet, client) {
    //console.log('Published', packet.payload);
    MessageService.handleMessage(sails.moment(), client, packet)
  });

  server.on('ready', setup);

  // fired when the mqtt server is ready
  function setup() {
    sails.log.info('Mosca server is up and running');
  }
};
