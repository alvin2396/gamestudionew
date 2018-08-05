/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
var bcrypt = require('bcrypt')
module.exports = {

  attributes: {

    username:{
          type: 'string',
      },
      email:{
          type: 'string',
          required:true,
          unique:true
      },
      password:{
          type: 'string',
          required:true
      },

      photo_url : {
        type : 'string'
      },

      nama:{
        type: 'string',
      },

      alamat:{
        type:'string',
      },

      processor_score : {
        type : 'string',
      },

      vga_score : {
        type : 'string'
      },

      ram_score : {
        type : 'string'
      },

      processor_id :{
        model : 'processor'
      },

      vga_id : {
        model : 'vga'
      },

      ram_id : {
        model : 'ram'
      },

      own_cart : {
        collection : 'cart',
        via : 'user_id'
      },

      wallet : {
        type : 'string'
      },

      genre : {
        type : 'array'
      },

      ratings : {
        collection : 'rating',
        via : 'user_id',
      },

      
      toJSON: function(){
      var obj = this.toObject();
      delete obj.password;
      delete obj.csrf;
      return obj;
    },
  },

  beforeCreate: function(user, cb) {
      bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) {
                console.log(err);
                cb(err);
            } else {
                user.password = hash;
                console.log(hash);
                cb(null, user);
            }
          });
      });
  },
  
  
  comparePassword : function (password, user, cb) {
    bcrypt.compare(password, user.password, function (err, match) {

      if(err) cb(err);
      if(match) {
        cb(null, true);
      } else {
        cb(err);
      }
    });
  },
  connection:'database'
};

