/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
   adminpanel : function(req,res){
        res.view('admin/Dashboard',{
            layout : false,
            status : 'OK',
            title : 'Dashboard',
        })
   },

   userdata : function(req,res){
       User.find().exec(function(err,datauser){
           if(err){
               return res.serverError(err);
           }
           else{
               console.log(datauser)
               User.count().exec(function(err, usercount){
                Games.count().exec(function(err,gamescount){
                    Owngame.count().exec(function(err, owngamecount){
                        res.view('admin/Dashboard',{
                            status : 'OK',
                            title : 'Dashboard',
                            layout : false,
                            datauser : datauser,
                            usercount : usercount,
                            gamescount :gamescount,
                            owngamecount : owngamecount,
                        })
                    })
                })
               })
               
           }
       })
   },

   gamepanel : function(req,res){
    res.view('admin/gamepanel',{
        layout : false,
        status : 'OK',
        title : 'Dashboard',
    })
   },

   gamedata : function(req,res){
    User.find().exec(function(err,datauser){
        if(err){
            return res.serverError(err);
        }
        else{
            console.log(datauser)
            User.count().exec(function(err, usercount){
             Games.count().exec(function(err,gamescount){
                 Owngame.count().exec(function(err, owngamecount){
                     Games.find().populateAll().exec(function(err,datagame){
                         console.log(datagame)
                        res.view('admin/gamepanel',{
                            status : 'OK',
                            title : 'Dashboard',
                            layout : false,
                            datauser : datauser,
                            usercount : usercount,
                            gamescount :gamescount,
                            owngamecount : owngamecount,
                            datagame : datagame,
                        })
                     })
                 })
             })
            })
            
        }
    })
   }



};

