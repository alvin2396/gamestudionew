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

'POST /search/:page':{
  controller:"games",
  action:"search"
} ,

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

'GET /rekomendasi/rekomendasi' : {
  controller : 'rekomendasi',
  action : "matriks",
},

'GET /cart/checkcart' : {
  controller : 'cart',
  action : "checkcart",
},

'GET /user/uploadPhotoProfil' : {
  controller : 'user',
  action : "uploadPhotoProfil",
},

'GET /vga/updatescore' : {
  view : 'admin/updateVga'
},

'GET /user/updateSpek' : {
  controller : 'user',
  action : "updateSpek",
},

'GET /cart/checkout' : {
  controller : 'cart',
  action : "checkout",
},

'GET /games/populargameMobile' : {
  controller : 'games',
  action : "populargameMobile",
},

'GET /games/populargameMobile' : {
  controller : 'games',
  action : "populargameMobile",
},

'POST /masuk' : {
  controller : 'UserMobile',
  action : "mobilelogin",
},

'POST /games/populargameMobile' : {
  controller : 'games',
  action : "populargameMobile",
},

'POST /games/newgameMobile' : {
  controller : 'games',
  action : "newgameMobile",
},

'POST /rating/addreview' : {
  controller : 'rating',
  action : "addreview",
},

'POST /games/detailGameMobile/:id' : {
  controller : 'games',
  action : "detailGameMobile",
},

'GET /admin/adminpanel' : {
  controller : 'admin',
  action : "userdata",
},

'GET /admin/gamepanel' : {
  controller : 'admin',
  action : "gamedata",
},

'POST /cart/getCartmobile' : {
  controller : 'cart',
  action : "getCartmobile",
},

'GET /admin/korelasipanel' : {
  controller : 'admin',
  action : "matriks",
},

'GET /admin/salespanel' : {
  controller : 'admin',
  action : "listowngameweb",
},

'GET /admin/frekuensipanel' : {
  controller : 'admin',
  action : "frekuensigenre",
},

'GET /admin/adminrekomendasi' : {
  controller : 'admin',
  action : "rekomendasi",
},

'POST /admin/gameedit' : {
  controller : 'admin',
  action : "editgame",
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
