/**
 * RamController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  add:function(req,res){
        res.view('admin/addRam')
    },

    getram : function(req,res){
        Ram.find().sort('ram_score ASC').exec(function(err, ram){
            if(err){
                return res.serverError(err);
            }
            else{
                return res.json(ram);
            }
        })
    },

    findram : function(req,res){
        Ram.findOne({id : req.param('ram_id')}).exec(function(err, findram){
            if(err){
                return res.serverError(err);
            }
            else{
                res.json(findram)
            }
        })
    }

};

