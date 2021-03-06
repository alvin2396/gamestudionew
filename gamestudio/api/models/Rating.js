/**
 * Rating.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    user_id : {
        model : 'user',
        required:true,
    },

    game_id : {
        model : 'games',
        required:true,
    },

    rating_value : {
        type : 'string'
    },

     gameplay_value : {
      type: 'string'
    },

    graphic_value : {
      type : 'string'
    },

    controls_value : {
      type : 'string'
    },

    story_value : {
      type : 'string'
    },

    music_value : {
      type : 'string'
    },

    review : {
      type : 'string'
    }

  },
  connection:'database',

};

