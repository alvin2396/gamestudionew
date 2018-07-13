/**
 * Transaksi.js
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
  total : {
    type : 'string',
    required : true,
  },
  status : {
    type : 'string',
    required : true,
  },
  confirmation_code : {
    type : 'string',
    required : true,
  }



  },
  connection : 'database'

};

