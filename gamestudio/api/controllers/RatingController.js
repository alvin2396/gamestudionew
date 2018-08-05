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
                            gameplay : (((parseFloat(feature.gameplay) * parseFloat(ratecount))+ parseFloat(req.param('gameplay_value'))) / (parseFloat(ratecount) + 1 )).toFixed(2),
                            graphic : (((parseFloat(feature.graphic) * parseFloat(ratecount))+ parseFloat(req.param('graphic_value'))) / (parseFloat(ratecount) + 1 )).toFixed(2),
                            controls : (((parseFloat(feature.controls) * parseFloat(ratecount))+ parseFloat(req.param('controls_value'))) / (parseFloat(ratecount) + 1 )).toFixed(2),
                            story : (((parseFloat(feature.story) * parseFloat(ratecount))+ parseFloat(req.param('story_value'))) / (parseFloat(ratecount) + 1 )).toFixed(2),
                            music : (((parseFloat(feature.music) * parseFloat(ratecount))+ parseFloat(req.param('music_value'))) / (parseFloat(ratecount) + 1 ).toFixed(2)),
                            
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
                                rating : (((parseFloat(games.rating) * parseFloat(ratecount))+ parseFloat(req.param('rating_value'))) / (parseFloat(ratecount) + 1 )).toFixed(2),
                                rated : (parseFloat(ratecount)+1).toString()
                              }
                              Games.update(req.param('game_id'),gameObj,function(err){
                                  if(err){
                                      return res.serverError(err)
                                  }
                                  else{
                                    Rating.create(req.body).exec(function(err,rating){
                                        if(err){
                                            return res.serverError(err);
                                        }
                                        else{
                                            console.log(rating)
                                            res.redirect('/');
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

};

