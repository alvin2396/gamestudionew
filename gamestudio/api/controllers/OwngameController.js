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
    },

    listowngame : function(req,res){
        User.findOne({email : req.param('email')}).exec(function(err,user){
            Owngame.find({user_id : user.id}).exec(function(err, owngame){
                datagame = []
                async.each(owngame,function(getowndata,callback){
                    Games.findOne({id : getowndata.game_id}).exec(function(err,gamesown){
                        datagame.push({
                            id : gamesown.id,
                            photo_url : gamesown.photo_url,
                            game_name : gamesown.game_name,
                            harga : gamesown.harga
                        })
                        callback()
                    })
                },function(err){
                    if(err){
                        return res.serverError(err);
                    }
                    else{
                        res.json(datagame)
                    }
                })
            })
        })
    },

    

};

