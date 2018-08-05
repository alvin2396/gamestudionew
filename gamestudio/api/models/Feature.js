/**
 * Feature.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    
    game_id : {
      model : 'games',
      required:true,
    },

    gameplay : {
      type : 'string'
    },

    graphic : {
      type : 'string'
    },

    controls : {
      type : 'string'
    },

    story : {
      type : 'string'
    },

    music : {
      type : 'string'
    }

  },
  connection:'database'

};

