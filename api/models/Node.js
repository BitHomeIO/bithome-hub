/**
* Node.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    nodeId : { type: 'text' },
    name : { type: 'text' },
    source : { type: 'text' },
    createdAt : { type: 'datetime' }
  }
};

