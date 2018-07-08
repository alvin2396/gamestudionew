/**
 * Spesifikasi.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

   ram_id: {
        model: 'ram',
        required : true,
   },

   processor_id: {
        model: 'processor',
        required : true,
   },

   vga_id: {
        model: 'vga',
        required : true,
   },

   game_id : {
    model : 'games',
    required : true,
   },
   
   status : {
    type : 'string',
    required : true,
   },



  },
  connection : 'database'

};

