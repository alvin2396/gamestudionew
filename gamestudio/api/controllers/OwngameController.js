/**
 * OwngameController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    getowngamemobile : function(req,res){
        User.findOne({email : req.param('email')}).exec(function(err, user){
            Owngame.find({user_id : user.id}).exec(function(err, owngame){
                if(err){
                    return res.serverError(err);
                }
                else{
                    res.json(owngame);
                }
            })
        })
    }

};

