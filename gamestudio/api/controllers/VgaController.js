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

  getvga : function(req,res){
    Vga.find().sort('vga_name ASC').exec(function(err, vga){
        if(err){
            return res.serverError(err);
        }
        else{
            return res.json(vga);
        }
    })
},

findvga : function(req,res){
  Vga.findOne({id : req.param('vga_id')}).exec(function(err, findvga){
      if(err){
          return res.serverError(err);
      }
      else{
          res.json(findvga)
      }
  })
}

};

