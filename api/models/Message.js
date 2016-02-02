/**
* Message.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    clientId : { type: 'text' },
    topic : { type: 'text' },
    message : { type: 'text' },
    createdAt : { type: 'datetime' },
    updatedAt : { type: 'datetime' },
  }
};

