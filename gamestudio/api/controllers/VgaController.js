/**
 * VgaController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  add:function(req,res){
        res.view('admin/addVga')
    },

    updateVga:function(req,res,next){
    var userObj = {
      id: req.param('id'),
      vga_score : req.param('vga_score'),
    }
    
    
      Vga.update(req.param('id'),userObj,function(err,updated){
      
        if(err){
          console.log(err);
        }
        else{
          var ubahSuccess = [
            'Vga updated!',
          ]
          req.session.flash = {
            err: ubahSuccess
          // If error redirect back to sign-up page
          }
          return res.json(updated);
        }
      })
    
  },

  updatescore : function(req,res){
  	res.view('/admin/updateVga')
  },

};

