/**
 * FeatureController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    add:function(req,res){
        res.view('admin/addfeature')
    },

    getfeature : function(req,res){
        Feature.findOne({game_id : req.param('game_id')}).exec(function(err, feature){
            if(err){
                return res.serverError(err);
            }
            else{
                res.json(feature)
            }
        })
    }

};

