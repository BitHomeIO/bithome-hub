/**
* Node.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    id : {
      type: 'text',
      primaryKey: true
    },
    name : { type: 'text' },
    source : { type: 'text' },
    capabilities : {
      collection: 'capability',
      via: 'node',
    },
    createdAt : { type: 'datetime' }
  }
};

