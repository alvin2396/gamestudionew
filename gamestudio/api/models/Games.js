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

    genre:{
        type: 'string'
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
        model : 'spesifikasi'
    },

    recommended_requirement : {
        model : 'spesifikasi'
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

    Story_rating : {
        type : 'number'
    },

    gameplay_rating : {
        type : 'number'
    },

    controls_rating : {
        type : 'number'
    },

    music_rating : {
        type : 'number'
    },

    graphic_rating : {
        type : 'number'
    },

    publisher : {
        type : 'string'
    },



  },
  connection : 'database'

};

