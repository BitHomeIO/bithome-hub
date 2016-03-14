module.exports = {

  nodeSourceMap: {},

  /**
   * Initialize the node service
   */
  init: function() {
    this._loadSourceMap();
  },

  /**
   * Attempt to add a new node if it is a node ID that hasn't been seen before
   * @param nodeId
   * @param name
   * @param source
   */
  addNode: function (nodeId, name, source) {
    var that = this;
    // First check to see if we have a node for this node ID
    this.getNode(nodeId, function(results) {
      if (results) {
        sails.log.debug('Already have node for nodeId: ' + nodeId);
      } else {
        that._saveNode(nodeId, name, source);
      }
    });
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
  },

  /**
   * Load the nodes from storage into the source map
   */
  _loadSourceMap: function () {
    var that = this;

    Node.find().exec(
      function callback(error, nodes) {
        if (error) {
          sails.log.error(error);
        } else {
          _.each(nodes, function(node) {
            sails.log.debug('Loading nodeId:' + node.nodeId + ' to source ' + node.source);

            // Only map external sources
            if (node.source != 'mqtt') {
              that.nodeSourceMap[node.nodeId] = node.source;
            }
          });
        }
      }
    );
  },

  /**
   * Save the node to storage
   */
  _saveNode: function (nodeId, name, source) {

    NodeService.sourceMap[nodeId] = source;

    var timestamp = sails.moment();

    Node.create(
      {
        nodeId: nodeId,
        name: name,
        source: source,
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
  }

};