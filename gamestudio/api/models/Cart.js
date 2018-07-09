/**
 * Cart.js
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

    nama_game : {
      type : 'string'
    },

    id_game : {
      type : 'string'
    },

    harga : {
      type : 'string'
    },

  },
  connection : 'database'

};

