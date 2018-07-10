/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  'GET /': {
    controller : 'games',
    action : "gamePopular",
  },

 'GET /login':{
    controller: 'session',
    action: "login",
 },

  'GET /user/profile/:id': {
  controller: 'user',
  action: "userProfile",
},
'GET /user/edit-profile/:id': {
  controller: 'user',
  action: "editProfile",
},
 'GET /games/detailGame/:id':{
    controller:'games',
    action:"detailGame",
 } ,
'GET /games/add': {
    view:'admin/addGame',
},

'GET /games/popular/:page' : {
  controller : 'games',
  action : "populargame",
},

'GET /games/newgame/:page' : {
  controller : 'games',
  action : "newgame",
},

'GET /genrelist/add' : {
  view:'admin/addGenreList'
},

'GET /ram/add' : {
  view:'admin/addRam'
},

'GET /processor/add' : {
  view:'admin/addProcessor'
},

'GET /vga/add' : {
  view:'admin/addVga'
},

 'GET /register':{
    controller: 'session',
    action: "register",
 },

 'GET/games/addspesifikasi' : {
  view : 'admin/addSpesifikasi'
 },

'GET /games/updatespesifikasi' : {
  view : 'admin/updatespek'
},

'GET /spesifikasi/add' : {
  view : 'admin/addSpesifikasi'
},

'GET /games/rekomendasi' : {
  controller : 'games',
  action : "rekomendasi",
},

'GET /cart/checkcart' : {
  controller : 'cart',
  action : "checkcart",
},

'GET /user/uploadPhotoProfil' : {
  controller : 'user',
  action : "uploadPhotoProfil",
}

 
  

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
