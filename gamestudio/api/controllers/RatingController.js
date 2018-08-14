/**
 * RatingController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    add : function(req,res){
        res.view('admin/addreview')
    },
    
  
    addreview : function(req,res){
        Games.findOne({id : req.param('game_id')}).exec(function(err, games){
            if(err){
                return res.serverError(err);
            }
            else{
                var ratecount
                
                var review = req.param('review');
                
                if(typeof(games.rated) == "undefined"){
                    ratecount = 100;
                }
                else{
                    ratecount = games.rated;
                }

                Feature.findOne({game_id : games.id}).exec(function(err, feature){
                    if(err){
                        return res.serverError(err);
                    }
                    else{
                        var featureObj = {
                            gameplay : (((parseFloat(feature.gameplay) * parseFloat(ratecount))+ parseFloat(req.param('gameplay_value'))) / (parseFloat(ratecount) + 1 )).toFixed(1),
                            graphic : (((parseFloat(feature.graphic) * parseFloat(ratecount))+ parseFloat(req.param('graphic_value'))) / (parseFloat(ratecount) + 1 )).toFixed(1),
                            controls : (((parseFloat(feature.controls) * parseFloat(ratecount))+ parseFloat(req.param('controls_value'))) / (parseFloat(ratecount) + 1 )).toFixed(1),
                            story : (((parseFloat(feature.story) * parseFloat(ratecount))+ parseFloat(req.param('story_value'))) / (parseFloat(ratecount) + 1 )).toFixed(1),
                            music : (((parseFloat(feature.music) * parseFloat(ratecount))+ parseFloat(req.param('music_value'))) / (parseFloat(ratecount) + 1 )).toFixed(1),
                            
                           }

                           Feature.update(feature.id,featureObj,function(err){
      
                            if(err){
                              console.log(err);
                            }
                            else{
                              console.log('review added')
                              
                              var ubahSuccess = [
                                'Review Added',
                              ]
                              req.session.flash = {
                                err: ubahSuccess
                              // If error redirect back to sign-up.. page
                              }
                             
                              var gameObj = {
                                rating : (((parseFloat(games.rating) * parseFloat(ratecount))+ parseFloat(req.param('rating_value'))) / (parseFloat(ratecount) + 1 )).toFixed(1),
                                rated : (parseFloat(ratecount)+1).toString()
                              }
                              Games.update(req.param('game_id'),gameObj,function(err){
                                  if(err){
                                      return res.serverError(err)
                                  }
                                  else{
                                    Rating.findOne({user_id : req.session.User.id}).where({game_id : games.id }).exec(function(err, findrating){
                                        if(findrating){
                                            var ratingObj = {
                                                rating_value : req.param('rating_value'),
                                                gameplay_value : req.param('gameplay_value'),
                                                graphic_value : req.param('graphic_value'),
                                                controls_value : req.param('controls_value'),
                                                story_value : req.param('story_value'),
                                                music_value : req.param('music_value'),
                                                review : req.param('review'),
                                            }

                                            Rating.update(findrating.id,ratingObj,function(err){
                                                if(err){
                                                    return res.serverError(err);
                                                }
                                                else{

                                                    var ubahSuccess = [
                                                        'Review Added',
                                                      ]
                                                      req.session.flash = {
                                                        err: ubahSuccess
                                                      // If error redirect back to sign-up.. page
                                                      }
                                                      res.redirect('/games/detailGame/'+games.id);
                                                }
                                            })
                                        }
                                        else{
                                            Rating.create(req.body).exec(function(err,rating){
                                                if(err){
                                                    return res.serverError(err);
                                                }
                                                else{
                                                    console.log(rating)
                                                    res.redirect('/games/detailGame/'+games.id);
                                                }
                                            })
                                        }
                                    })
                                  }
                              })

                            }
                          })
                        
                        

                        
                        

                    }
                })
                
            }
        })
    },

    showratingmobile : function(req,res){
        Rating.find({game_id : req.param('game_id')}).exec(function(err,rating){
            if(err){
                return res.serverError(err);
            }
            else{
                datarating = []
                async.each(rating,function(getuser,callback){
                    User.findOne({id : getuser.user_id}).exec(function(err, userdata){
                        datarating.push({
                            user_name : userdata.nama,
                            rating : getuser.rating_value,
                            photo_url : userdata.photo_url,
                            review : getuser.review
                        })
                        callback()
                    })
                },function(err){
                    if(err){
                        return res.serverError(err);
                    }
                    else{
                        res.json(datarating)
                    }
                })
            }
        })
    }

};

