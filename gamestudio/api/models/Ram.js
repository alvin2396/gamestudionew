/**
 * Ram.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    ram_id: {
        type: 'string'
    },

    ram_size: {
        type: 'string'
    },

    ram_score: {
        type: 'number'
    },

  },
  connection : 'database'

};

