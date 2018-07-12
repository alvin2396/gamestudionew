/**
 * GamesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  detailGame: function (req, res, next) {

        Games.findOne(req.param('id')).populateAll().exec(function (err, games) {
            if (err) {
                return res.serverError(err);
            }
            else {

                games.genreStrings = []
                games.userStrings = []
                async.each(games.genre_lists, function (genre, callback) {
                    Genre.findOne({ id: genre.genre_id }).exec(function (err, genres) {
                        if (err) {
                            callback(err)
                        } else {

                            games.genreStrings.push({
                                id: genres.id,
                                nama_genre: genres.genre_name
                            })
                            callback()
                        }
                    })
                }, function (err) { // function ini akan jalan bila semua genre_lists telah diproses

                    if (err)
                        return res.serverError(err);
                    else {
                        games.min_spek_intel = []
                        games.rec_spek =[]
                            async.each(games.min_requirement,function(spek, callback){
                                
                                Spesifikasi.findOne({id:spek.id}).exec(function(err, min_spek){
                                    
                                    if(err){
                                        callback(err)
                                    }
                                    else{
                                        if(min_spek.status == 'minimum'){
                                        	games.min_spek_intel.push({
                                            processor_id : min_spek.processor_id,
                                            vga_id : min_spek.vga_id,
                                            ram_id : min_spek.ram_id,
                                            status : min_spek.status
                                        })
                                        }
                                        if(min_spek.status == 'recommend'){

                                        	games.rec_spek.push({
                                            processor_id : min_spek.processor_id,
                                            vga_id : min_spek.vga_id,
                                            ram_id : min_spek.ram_id,
                                            status : min_spek.status
                                        })
                                        }
                        
                                        callback()
                                    }
                                })
                            },function(err){
                                

                                if(err){
                                    return res.serverError(err);
                                }
                                else{
                                    Ram.findOne({id:games.min_spek_intel[0].ram_id}).exec(function(err,getRam){
                                    	Ram.findOne({id:games.rec_spek[0].ram_id}).exec(function(err, recRam){
                                    		Processor.findOne({id:games.rec_spek[0].processor_id}).exec(function(err, recProc){
                                    			Vga.findOne({id:games.rec_spek[0].vga_id}).exec(function(err, recVga){
                                    				Processor.findOne({id:games.min_spek_intel[0].processor_id}).exec(function(err,getProc){
			                                            Vga.findOne({id:games.min_spek_intel[0].vga_id}).exec(function(err,getVga){
			                                                if(req.session.User){
                                                                User.findOne({id:req.session.User.id}).exec(function(err,user){
                                                                    Processor.findOne({id:user.processor_id}).exec(function(err,userprocessor){
                                                                        Vga.findOne({id:user.vga_id}).exec(function(err,uservga){
                                                                            Ram.findOne({id:user.ram_id}).exec(function(err,userram){
                                                                                Cart.find({user_id:req.session.User.id}).exec(function(err,updatecart){
                                                                                    console.log(updatecart)
                                                                                    res.view("user/gameDetail/", {
                                                                                        status: 'OK',
                                                                                        title: 'Detail Game',
                                                                                        games: games,
                                                                                        getRam : getRam,
                                                                                        getProc : getProc,
                                                                                        getVga : getVga,
                                                                                        recProc : recProc,
                                                                                        recRam : recRam,
                                                                                        recVga : recVga,
                                                                                        uservga : uservga,
                                                                                        userram : userram,
                                                                                        userprocessor : userprocessor,
                                                                                        user : user,
                                                                                        updatecart : updatecart,
                                                                                        })
                                                                                })
                                                                                    if(parseInt(userprocessor.processor_score) >= parseInt(getProc.processor_score) && parseInt(userram.ram_score) >= parseInt(getRam.ram_score ) && parseInt(uservga.vga_score) >= parseInt(getVga.vga_score)){
                                                                                        console.log('true')
                                                                                    }
                                                                                    else{
                                                                                        console.log('false')
                                                                                        console.log(parseInt(userprocessor.processor_score))
                                                                                        console.log(parseInt(getProc.processor_score))
                                                                                        if(parseInt(userprocessor.processor_score) < parseInt(getProc.processor_score)){
                                                                                            console.log('processor low')
                                                                                            console.log(userprocessor.processor_score)
                                                                                            console.log(userprocessor)
                                                                                            console.log(getProc.processor_score)
                                                                                            console.log(getProc)
                                                                                        }
                                                                                        else if(uservga.vga_score < getVga.vga_score){
                                                                                            console.log('vga low')
                                                                                            console.log(uservga.vga_score)
                                                                                            console.log(uservga)
                                                                                            console.log(getVga.vga_score)
                                                                                            console.log(getVga)
                                                                                            
                                                                                        }
                                                                                        else if(userram.ram_score < getRam.ram_score){
                                                                                            console.log('ram low')
                                                                                            console.log(userram.ram_score)
                                                                                            console.log(userram)
                                                                                            console.log(getRam.ram_score)
                                                                                            console.log(getRam)
                                                                                        }
                                                                                    }
                                                                            })
                                                                        })
                                                                    })
                                                                })
                                                            }
                                                            else{
                                                                res.view("user/gameDetail/", {
                                                                    status: 'OK',
                                                                    title: 'Detail Game',
                                                                    games: games,
                                                                    getRam : getRam,
                                                                    getProc : getProc,
                                                                    getVga : getVga,
                                                                    recProc : recProc,
                                                                    recRam : recRam,
                                                                    recVga : recVga,
                                                                    })
                                                            }	                                                
			                                            })
			                                        })
                                    			})
                                    		})
                                    	})
                                      })

                                    
                                }
                            })
                            

                        
                        


                    }
                })

            }
        })
    },

   

    updatetgal:function(req,res){
        var gameObj = {
            release_date:req.param('release_date')
        }

        Games.update(req.param('id'),gameObj,function(err, updated){
            if(err){
                return res.serverError(err);
            }
            else{
                return res.json(updated);
            }
        
        })
    },

    updatespeks:function(req,res,next){
        var gameObj = {
            OS : req.param('OS'),
            HDD_space : req.param('HDD_space'),
        }

        Games.update(req.param('id'),gameObj,function(err, updated){
            if(err){
                return res.serverError(err);
            }
            else{
                return res.json(updated);
            }
        
        })
    },

    updatespesifikasi:function(req,res){
        res.view('admin/updatespek')
    },

    checkdataspek:function(req,res){
        var spek = []
        var spek_rec = []
        Games.findOne({id : '5b376c7400217d253ccd2d73'}).exec(function(err,amd){
            if(err){
                return res.serverError(err);
            }
            else{
                console.log(amd);
                
                Spesifikasi.findOne({id : amd.min_requirement}).exec(function(err,Spesifikasi_min){
                    if(err){
                        return res.serverError(err);
                    }
                    else{
                        console.log(amd.min_requirement);
                        Spesifikasi.findOne({id : amd.recommended_requirement}).exec(function(err,spesifikasi_rec){
                            if(err){
                                return res.serverError(err);
                            }
                            else{
                                console.log(spesifikasi_rec)
                            }
                        })
                        /*spek.push({
                            intel_proc : Spesifikasi_min.processor_id,
                            intel_vga : Spesifikasi_min.vga_id,
                            ram : Spesifikasi_min.ram_id
                        })
                        console.log(spek);
                        return res.json(Spesifikasi_min);*/
                    }
                })
            }
    })
    },

    populargame: function(req,res,next){
        var perPage = 21
            if(!req.params.page){
                var page =1
            }
            else{
                var page = req.params.page
            }
        Games.find().sort('rating DESC')
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .populateAll().exec(function(err,games_popular){
            Games.count().exec(function(err,count){
                if(err){
                return res.serverError(err);
            }
            else{
                if(req.session.User){
                    Cart.find({user_id : req.session.User.id}).exec(function(err, updatecart){
                        res.view('user/popularGame',{
                            status : 'OK',
                            title : 'Popular Games',
                            games_popular : games_popular,
                            current: page,
                            pages: Math.ceil(count / perPage),
                            updatecart : updatecart,
                        })
                    })
                }
                else{
                    res.view('user/popularGame',{
                        status : 'OK',
                        title : 'Popular Games',
                        games_popular : games_popular,
                        current: page,
                        pages: Math.ceil(count / perPage)
                    })
                }
            }
            })
        })
    },

    newgame: function(req,res,next){
        var perPage = 21
            if(!req.params.page){
                var page =1
            }
            else{
                var page = req.params.page
            }
        Games.find().sort('release_date DESC')
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .populateAll().exec(function(err,new_game){
            Games.count().exec(function(err,count){
                if(err){
                return res.serverError(err);
            }
            else{
                if(req.session.User){
                    Cart.find({user_id : req.session.User.id}).exec(function(err, updatecart){
                        res.view('user/newGame',{
                            status : 'OK',
                            title : 'New Games',
                            new_game : new_game,
                            current: page,
                            pages: Math.ceil(count / perPage),
                            updatecart : updatecart,
                        })
                    })
                }
                else{
                    res.view('user/newGame',{
                        status : 'OK',
                        title : 'New Games',
                        new_game : new_game,
                        current: page,
                        pages: Math.ceil(count / perPage)
                    })
                }
            }
            })
        })
    },

    gamePopular: function(req,res){
        
        Games.find().sort('rating DESC').limit(4).populateAll().exec(function(err,games){
            if(err)
                return res.serverError(err);
            else{
                games.genreStrings = []
                games.userStrings = []
                async.each(games.genre_lists, function (genre, callback){
                    Genre.findOne({ id: genre.genre_id }).exec(function (err, genres){
                        if(err){
                            callback(err)
                        }
                        else{
                            games.genreStrings.push({
                                id: genres.id,
                                nama_genre: genres.genre_name
                            })
                            callback()
                        }
                    })
                },function(err){
                    if(err){
                        return res.serverError(err);
                    }
                    else{
                        Games.find().sort('release_date DESC').limit(4).exec(function(err,newgame){
                            if(err){
                                return res.serverError(err);
                            }
                            else{
                                Games.find().populateAll().exec(function(err, listgame){
                                    if(err){
                                        return res.serverError(err);
                                    }
                                    else{
                                        Games.find().sort('rating DESC').limit(3).populateAll().exec(function(err,limitgames){
                                            if(err){
                                                return res.serverError(err);
                                            }
                                            else{
                                                Games.find().sort('release_date DESC').limit(3).populateAll().exec(function(err, limitnew){
                                                    if(err){
                                                        return res.serverError(err);
                                                    }
                                                    else{

                                                        if(req.session.User){
                                                            console.log('log in')
                                                            User.findOne({id:req.session.User.id}).exec(function(err, user){
                                                                if(err){
                                                                    return res.serverError(err);
                                                                }
                                                                else{

                                                                    Cart.find({user_id : req.session.User.id}).exec(function(err, updatecart){
                                                                        if(err){
                                                                            return res.serverError(err);
                                                                        }
                                                                        else{
                                                                            
                                                                            res.view('homepage',{
                                                                            status : 'OK',
                                                                            title : 'Game Studio',
                                                                            games : games,
                                                                            newgame : newgame,
                                                                            listgame : listgame,
                                                                            limitgames : limitgames,
                                                                            limitnew : limitnew,
                                                                            user : user,
                                                                            updatecart : updatecart
                                                                            })
                                                                        }
                                                                    })
                                                                    
                                                                }
                                                            })
                                                            
                                                        }
                                                        else{
                                                            console.log('not log in')
                                                            res.view('homepage',{
                                                            status : 'OK',
                                                            title : 'Game Studio',
                                                            games : games,
                                                            newgame : newgame,
                                                            listgame : listgame,
                                                            limitgames : limitgames,
                                                            limitnew : limitnew
                                                            })
                                                        }
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            
                            }
                        })
                    }
                }

                )
            }
        })
        
    },

    search: function (req, res, next) {
        Games.find({ like: { game_name: '%' + req.param('search') + '%' } })
        .exec(function (err, search) {
            if (err) {
                return res.serverError(err);
            }
            else {
                res.view("user/search/", {
                    status: 'OK',
                    title: 'Search Result',
                    search: search,
                })
            }
            
       
    })
    },


    searchlist: function(req,res,next){
        
        Games.find().populateAll().exec(function(err,listgame){
            if(err){
                return res.serverError(err);
            }
            else{
                listgame.arr = []
                async.each(listgame.game_name, function(gamearr, callback){
                    if(err){
                        callback(err)
                    }
                    else{
                        listgame.arr.push({
                    game_name: gamearr.game_name
                        })
                        callback()
                    }
                })
                res.view("user/autocomplete", {
                    status : 'OK',
                    title : 'tes search',
                    listgame:listgame
                })
            }
        })
    },

    add:function(req,res){
        res.view('admin/addGame')
    },

    

};

