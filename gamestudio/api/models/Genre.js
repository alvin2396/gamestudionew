/**
 * Genre.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    genres : {
        collection:'genrelist',
        via : 'genre_id'
    },

    genre_name : {
        type: 'string'
    },

  },
  connection :'database'

};

