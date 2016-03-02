module.exports = {

  saveNode: function (nodeId) {

    var timestamp = sails.moment();

    Node.create(
      {
        nodeId: nodeId,
        createdAt: timestamp.toDate()
      }).exec(
      function callback(error, created) {
        if (error) {
          sails.log.error(error);
        } else {
          sails.sockets.broadcast('node', 'node_created', created);

          sails.log.debug("[" + timestamp.format() + "] node " + nodeId + " saved");
        }
      }
    );
  },


  getNode: function (nodeId, cb) {
    Node.findOne({nodeId: nodeId}).exec(
      function(err, results) {
        if (!err) {
          return cb(results);
        }
      }
    );
  },

  query: function (limit, offset, cb) {
    Node.find({skip: offset, limit: limit}).sort({createdAt:-1}).exec(
      function(err, results) {
        if (!err) {
          return cb(results);
        }
      }
    );
  },

  clear: function() {
    Node.drop();
  }
};