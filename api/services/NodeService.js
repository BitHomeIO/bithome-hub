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
      if (!results) {
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
   * Add a node capabilities
   */
  addNodeCapabilities: function (nodeId, capabilities) {
    var that = this;

    _.each(capabilities, function(capability) {
      that.addNodeCapability(nodeId, capability);
    });
  },

  /**
   * Add a node capability
   */
  addNodeCapability: function (nodeId, capability) {
    var that = this;

    Capability.count(
      {
        nodeId: nodeId,
        capability: capability
      }).exec(
      function callback(error, numFound) {
        if (error) {
          sails.log.error(error);
        } else if (numFound == 0) {
          that._saveNodeCapability(nodeId, capability);
        }
      }
    );
  },

  /**
   * Save the node to storage
   */
  _saveNode: function (nodeId, name, source) {

    NodeService.nodeSourceMap[nodeId] = source;

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
  },

  /**
   * Save the node capability to storage
   */
  _saveNodeCapability: function (nodeId, capability) {
    Capability.create(
      {
        nodeId: nodeId,
        capability: capability
      }).exec(
      function callback(error, created) {
        if (error) {
          sails.log.error(error);
        } else {
          sails.log.debug("node " + nodeId + " capability " + capability + " saved");
        }
      }
    );
  }

};