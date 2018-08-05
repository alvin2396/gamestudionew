/**
 * Owngame.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

   user_id : {
     model : 'user',
     required : true,
   },

   game_id : {
     model : 'games',
     required : true,
   }

  },
  connection:'database'

};

