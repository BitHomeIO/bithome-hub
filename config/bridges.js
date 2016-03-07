module.exports.bridges = {
  available: [],

  load: function (cb) {

    // Load the include-all library in order to require all of our grunt
    // configurations and task registrations dynamically.
    var includeAll;
    try {
      includeAll = require('include-all');
    } catch (e0) {
      try {
        includeAll = require('sails/node_modules/include-all');
      }
      catch (e1) {
        console.error('Could not find `include-all` module.');
        console.error('Skipping grunt tasks...');
        console.error('To fix this, please run:');
        console.error('npm install include-all --save`');
        console.error();
        return;
      }
    }

    var relPath = '../api/bridges';
    var bridgeClasses = includeAll({
        dirname: require('path').resolve(__dirname, relPath),
        filter: /(.+)\.js$/
      }) || {};

    _.each(bridgeClasses, function(bridge) {
      sails.config.bridges.available.push(bridge);
    });
  }
};
