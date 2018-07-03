/**
 * Genrelist.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    game_id :{
        model:'games',
        required:true
    },
    genre_id:{
        model:'genre',
        required:true
    }
   
  },
  connection :'database'

};

