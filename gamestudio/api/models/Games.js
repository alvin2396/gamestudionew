/**
 * Games.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    game_id : {
        type: 'string'
    },

    game_name : {
        type : 'string'
    },

    release_date : {
        type : 'string'
    },

    genre_lists:{
        collection : 'genrelist',
        via : 'game_id',
    },

    screenshot1_url : {
        type: 'string'
    },

    screenshot2_url : {
        type: 'string'
    },

    screenshot3_url : {
        type: 'string'
    },

    photo_url : {
        type : 'string'
    },

    video_url : {
        type : 'string'
    },

    harga : {
        type : 'string'
    },

    min_requirement : {
        collection : 'spesifikasi',
        via : 'game_id'
    },

    discount : {
        type : 'string'
    },

    description : {
        type : 'string'
    },

    OS : {
        type : 'string'
    },

    HDD_space : {
        type : 'string'
    },

    rating : {
        type : 'string'
    },

    publisher : {
        type : 'string'
    },

    min_ram : {
        model : 'ram'
    },

    min_vga : {
        model : 'vga'
    },

    min_processor : {
        model : 'processor'
    },

    rec_ram : {
        model : 'ram'
    },

    rec_vga : {
        model : 'vga'
    },

    rec_processor : {
        model : 'processor'
    }


  },
  connection : 'database'

};

