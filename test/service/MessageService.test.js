var mqtt = require("mqtt");
var expect = require('chai').expect;

describe('MessageService', function() {

  describe('Test message from MQTT', function() {
    it('Should return a message', function (done) {
      var client  = mqtt.connect('mqtt://localhost');

      client.on('connect', function () {
        client.publish('hub', 'test message');

        // Wait 500ms for the message to propagate
        setTimeout(function(){
          MessageService.query(10,0,
            function(result) {
              expect(result.length).to.equal(1);
              client.end();
              done();
            }
          );
        }, 500);

      });
    });
  });


});