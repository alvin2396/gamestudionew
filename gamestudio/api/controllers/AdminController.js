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
            User.count().exec(function(err, usercount){
             Games.count().exec(function(err,gamescount){
                 Owngame.count().exec(function(err, owngamecount){
                     Games.find().populateAll().sort('createdAt DESC').exec(function(err,datagame){
                        Processor.find().sort('processor_name ASC').populateAll().exec(function(err, processor){
                            Vga.find().sort('vga_name ASC').populateAll().exec(function(err,vga){
                                Ram.find().sort('ram_size ASC').populateAll().exec(function(err, ram){
                                    res.view('admin/gamepanel',{
                                        status : 'OK',
                                        title : 'Dashboard',
                                        layout : false,
                                        datauser : datauser,
                                        usercount : usercount,
                                        gamescount :gamescount,
                                        owngamecount : owngamecount,
                                        datagame : datagame,
                                        processor : processor,
                                        vga : vga,
                                        ram : ram,
                                    })
                                })
                            })
                        })
                     })
                 })
             })
            })
            
        }
    })
   },

   addgame : function(req,res){
       var genre = []
       var release_date = req.param('release_date')
       var rated = "100";
       var gameplay = "8.5"
       var music = "7.3"
       var controls = "8.0"
       var story = "8.3"
       var graphic = "8.8"

       genre = req.param('genre')
       
       Games.findOne({game_name : req.param('game_name')}).exec(function(err, gamefound){
           if(gamefound){
            var gameexist = [
                'Game already exist'
              ]
              req.session.flash = {
                err: gameexist
              }
              res.redirect('admin/gamepanel')
           }
           else{
            Games.create({
                game_name : req.param('game_name'),
                release_date : release_date.toString(),
                screenshot1_url : req.param('screenshot1_url'),
                screenshot2_url : req.param('screenshot2_url'),
                screenshot3_url : req.param('screenshot3_url'),
                photo_url : req.param('photo_url'),
                video_url : req.param('video_url'),
                harga : req.param('harga'),
                description : req.param('description'),
                OS : req.param('OS'),
                HDD_space : req.param('HDD_space'),
                rating : req.param('rating'),
                rated : rated,
                publisher : req.param('publisher')

            }).exec(function(err, gamecreated){
                if(err){
                    return res.serverError(err);
                }
                else{
                    for(var i = 0;i<genre.length;i++){
                        Genrelist.create({
                            game_id : gamecreated.id,
                            genre_id : genre[i]
                        }).exec(function(err, genrecreated){
                            if(err){
                                return res.serverError(err)
                                
                            }
                            else{
                                
                            }
                        })
                        
                    }
                    Feature.create({
                        game_id : gamecreated.id,
                        gameplay : gameplay,
                        graphic : graphic,
                        controls : controls,
                        story : story,
                        music : music
                    }).exec(function(err,featureadd){
                        if(err){
                            return res.serverError;
                        }
                        else{
                            Spesifikasi.create({
                                ram_id : req.param('ramminimum'),
                                vga_id : req.param('vgaminimum'),
                                processor_id : req.param('procminimum'),
                                game_id : gamecreated.id,
                                status : "minimum"
                            }).exec(function(err,minpsek){
                                if(err){
                                    return res.serverError(err);
                                }
                                else{
                                    Spesifikasi.create({
                                        ram_id : req.param('ramrec'),
                                        vga_id : req.param('vgarec'),
                                        processor_id : req.param('procrec'),
                                        game_id : gamecreated.id,
                                        status : "recommend"
                                    }).exec(function(err,recspek){
                                        if(err){
                                            return res.serverError(err);
                                        }
                                        else{
                                            var gameexist = [
                                                'Game added'
                                              ]
                                              req.session.flash = {
                                                err: gameexist
                                              }
                                              res.redirect('admin/gamepanel')
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

   matriks : function(req,res){
    Genre.native(function(err,collection){
        if(err){
            return res.serverError(err);
        }
        else{
            collection.find({},{
                genres : true,
                genre_name : true,
                

            }).toArray(function(err, datakorelasi){
                if(err){
                    return res.serverError(err);
                }
                else{
                    Genrelist.native(function(err, gamegenre){
                        if(err){
                            return res.serverError(err);
                        }
                        else{
                            gamegenre.find({},{
                                game_id : true,
                                genre_id : true,
                            }).toArray(function(err, gamedata){
                                if(err){
                                    return res.serverError(err);
                                }
                                else{
                                    var genre = []
                                    var total = 0;
                                    for(var i = 0;i<datakorelasi.length;i++){
                                        for(var j = i+1 ; j<gamedata.length;j++){
                                            if(gamedata[j].genre_id.toString() == datakorelasi[i]._id.toString()){
                                                total = total + 1 ;
                                            }
                                            
                                        }
                                        genre.push([datakorelasi[i].genre_name, total])
                                        total = 0;
                                    }
                                    
                                    
                                    Games.native(function(err, gamelist){
                                        if(err){
                                            return res.serverError(err);
                                        }
                                        else{
                                            gamelist.find({},{
                                                game_id : true,
                                                rating : true,
                                                harga : true,
                                                photo_url : true,
                                                game_name : true,
                                                release_date : true,
                                            }).toArray(function(err, listgame){
                                                if(err){
                                                    return res.serverError(err);
                                                }
                                                else{
                                                    //gamedata --> genrelist
                                                    //listgame --> games (247+)
                                                    //datakorelasi --> genre (19)
                                                    //genre --> frekuensi 1 genre
                                                    //getgenre --> list genre setiap game
                                                    
                                                    
                                                    
                                                    var get_genre = []
                                                    for(var i = 0;i<listgame.length;i++){
                                                        var data_arr = []
                                                        // console.log(count)
                                                        var count = 0;
                                                        for(var j = 0 ; j<gamedata.length;j++){
                                                            if(listgame[i]._id.toString() == gamedata[j].game_id.toString() ){
                                                                data_arr.push(gamedata[j].genre_id)
                                                                count += 1;
                                                                
                                                            }
                                                        }
                                                        get_genre.push(data_arr)
                                                    }
                                                    
                                                    
                                                    var jlh2genre = []
                                                                                                        
                                                    for(var i=0;i<datakorelasi.length;i++){
                                                        for(var j=0;j<datakorelasi.length;j++){
                                                            var doublecount = 0;
                                                            for(k=0;k<listgame.length;k++){
                                                                var get1 = false;
                                                                var get2 = false;
                                                                for(l=0;l<get_genre[k].length;l++){
                                                                    if(datakorelasi[i]._id.toString() == get_genre[k][l].toString() ){
                                                                        get1 = true;
                                                                    }
                                                                    else if(datakorelasi[j]._id.toString() == get_genre[k][l].toString() ){
                                                                        get2 = true;
                                                                    }
                                                                    

                                                                }
                                                                if(get1 == true && get2 == true){
                                                                    doublecount += 1;
                                                                }
                                                            }
                                                            jlh2genre.push([datakorelasi[i].genre_name,datakorelasi[j].genre_name,doublecount])
                                                        }
                                                    }

                                                    var korelasigenre=[]
                                                    
                                                    
                                                   
                                                    
                                                    for(var i =0;i<jlh2genre.length;i++){
                                                        if(jlh2genre[i][0].toString() == jlh2genre[i][1].toString() ){
                                                            korelasigenre.push([jlh2genre[i][0], jlh2genre[i][1], 100 ])
                                                        }
                                                        else{
                                                            var jumlah = 0;
                                                            for(j=0;j<genre.length;j++){
                                                                if(jlh2genre[i][0].toString() == genre[j][0].toString() ){
                                                                    jumlah = genre[j][1];
                                                                }
                                                            }
                                                            korelasigenre.push([jlh2genre[i][0], jlh2genre[i][1], (jlh2genre[i][2]/jumlah)*100 ])
                                                        }
                                                    }
                                                    var userprefrence = []
                                                    
                                                        
                                                        
                                                        userprefrence = ['5b34f1d3f7460b278469cc34', '5b34f1d1f7460b278469cc33', '5b34f1d8f7460b278469cc37']
                                                            
                                                            
                                                            var datarelasi = []
                                                            var recommendationdata = []
                                                    for(var i =0 ;i<get_genre.length;i++){
                                                        var recompoint = 0;
                                                        
                                                        var dataVn = 0;
                                                        getsama = false;
                                                       
                                                        for(var j=0;j<userprefrence.length;j++){
                                                            var beda = 0;
                                                            var sama = 0;
                                                            var vbeda =0
                                                            var vsama = 0
                                                            for(var k=0; k<get_genre[i].length;k++){
                                                                
                                                                if(userprefrence[j].toString() == get_genre[i][k].toString() ){
                                                                    vsama = 100;
                                                                    sama =1;
                                                                    getsama = true;
                                                                    //datarelasi.push(vsama)
                                                                }
                                                                else{
                                                                    for(gen1 = 0 ;gen1<korelasigenre.length;gen1++){
                                                                        if(korelasigenre[gen1][0].toString() == userprefrence[j] && korelasigenre[gen1][1].toString() == get_genre[i][k].toString() ){
                                                                            beda += korelasigenre[gen1][2];
                                                                        }
                                                                    }

                                                                }
                                                                
                                                                //dataVn.push(datarelasi)
                                                            }
                                                            vbeda += beda/(get_genre[i].length-sama)
                                                            dataVn += (vsama + vbeda);
                                                            datarelasi.push({
                                                                datavn : dataVn,
                                                                rating : listgame[i].rating,
                                                                UP : userprefrence.length,
                                                                angkabeda : beda,
                                                                game : listgame[i].game_name
                                                            })

                                                        }
                                                        recompoint = (dataVn*listgame[i].rating)/userprefrence.length;
                                                        recommendationdata.push({id : listgame[i]._id,rp :recompoint,game_name : listgame[i].game_name,photo_url : listgame[i].photo_url,rating : listgame[i].rating,release_date :listgame[i].release_date, harga : listgame[i].harga})
                                                    }
                                                    recommendationdata = recommendationdata.sort(function(a,b){
                                                        return b.rp - a.rp;
                                                    })

                                                    // console.log(listgame[0])
                                                    // console.log(listgame.length)
                                                    // console.log(get_genre.length)
                                                    // console.log(get_genre[0])
                                                    // console.log(recommendationdata)
                                                    // console.log(korelasigenre)
                                                    //console.log(genre)
                                                    // return res.json(korelasigenre)
                                                    // return res.json(korelasigenre)
                                                    res.view('admin/korelasipanel',{
                                                        status : 'OK',
                                                        title : 'Korelasi Panel',
                                                        layout : false,
                                                        korelasigenre : korelasigenre,
                                                        
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
        }
    })
},

userdelete : function(req,res){
    User.destroy({id : req.param('user_id')}).exec(function(err){
        if(err){
            return res.serverError(err);
        }
        else{
            res.redirect('/admin/adminpanel');
        }
    })
},

gamedelete : function(req,res){
    Genrelist.destroy({game_id : req.param('game_id')}).exec(function(err,genredeleted){
        if(err){
            return res.serverError(err)
        }
        else{
            Games.destroy({id: req.param('game_id')}).exec(function(err,deleted){
                if(err){
                    return res.serverError(err);
                }
                else{
                    var deleted = [
                        'Game deleted'
                      ]
                      req.session.flash = {
                        err: deleted
                      }
                    res.redirect('/admin/gamepanel');
                }
            })
        }
    })
},

listowngameweb : function(req,res){
    Owngame.find().exec(function(err,owngame){
        dataowngame = []
        async.each(owngame,function(getowngame,callback){
            Games.findOne({id : getowngame.game_id}).exec(function(err,datagame){
                dataowngame.push(datagame)
                callback()
            })

        },function(err){
            if(err){
                return res.serverError(err)
            }
            else{
                User.count().exec(function(err,usercount){
                    Games.count().exec(function(err,gamescount){
                        Owngame.count().exec(function(err,owngamecount){
                            Games.find().exec(function(err,games){
                                total = []
                                
                                for(var i =0;i<games.length;i++){
                                    var count = 0;
                                    for(var j =0 ;j<dataowngame.length;j++){
                                        if(games[i].id == dataowngame[j].id){
                                            count += 1;
                                        }
                                    }
                                    if(count > 0){
                                        total.push({
                                            nama_game : games[i].game_name,
                                            id : games[i].id,
                                            harga : games[i].harga,
                                            jumlah : count,
                                            total : parseFloat(games[i].harga)*count
                                        })
                                    }
                                    
                                }
                                res.view('admin/adminsales',{
                                    status : 'OK',
                                    title : 'Sales Panel',
                                    layout : false,
                                    usercount : usercount,
                                    gamescount : gamescount,
                                    owngamecount : owngamecount,
                                    total : total
                                })
                            })
                        })
                    })
                })
                
            }
        })
    })
},

frekuensigenre : function(req,res){
    Genre.native(function(err,collection){
        if(err){
            return res.serverError(err);
        }
        else{
            collection.find({},{
                genres : true,
                genre_name : true,
                

            }).toArray(function(err, datakorelasi){
                if(err){
                    return res.serverError(err);
                }
                else{
                    Genrelist.native(function(err, gamegenre){
                        if(err){
                            return res.serverError(err);
                        }
                        else{
                            gamegenre.find({},{
                                game_id : true,
                                genre_id : true,
                            }).toArray(function(err, gamedata){
                                if(err){
                                    return res.serverError(err);
                                }
                                else{
                                    var genre = []
                                    var total = 0;
                                    for(var i = 0;i<datakorelasi.length;i++){
                                        for(var j = i+1 ; j<gamedata.length;j++){
                                            if(gamedata[j].genre_id.toString() == datakorelasi[i]._id.toString()){
                                                total = total + 1 ;
                                            }
                                            
                                        }
                                        genre.push([datakorelasi[i].genre_name, total])
                                        total = 0;
                                    }
                                    
                                    
                                    Games.native(function(err, gamelist){
                                        if(err){
                                            return res.serverError(err);
                                        }
                                        else{
                                            gamelist.find({},{
                                                game_id : true,
                                                rating : true,
                                                harga : true,
                                                photo_url : true,
                                                game_name : true,
                                                release_date : true,
                                            }).toArray(function(err, listgame){
                                                if(err){
                                                    return res.serverError(err);
                                                }
                                                else{
                                                    //gamedata --> genrelist
                                                    //listgame --> games (247+)
                                                    //datakorelasi --> genre (19)
                                                    //genre --> frekuensi 1 genre
                                                    //getgenre --> list genre setiap game
                                                    
                                                    
                                                    
                                                    var get_genre = []
                                                    for(var i = 0;i<listgame.length;i++){
                                                        var data_arr = []
                                                        // console.log(count)
                                                        var count = 0;
                                                        for(var j = 0 ; j<gamedata.length;j++){
                                                            if(listgame[i]._id.toString() == gamedata[j].game_id.toString() ){
                                                                data_arr.push(gamedata[j].genre_id)
                                                                count += 1;
                                                                
                                                            }
                                                        }
                                                        get_genre.push(data_arr)
                                                    }
                                                    
                                                    
                                                    var jlh2genre = []
                                                                                                        
                                                    for(var i=0;i<datakorelasi.length;i++){
                                                        for(var j=0;j<datakorelasi.length;j++){
                                                            var doublecount = 0;
                                                            for(k=0;k<listgame.length;k++){
                                                                var get1 = false;
                                                                var get2 = false;
                                                                for(l=0;l<get_genre[k].length;l++){
                                                                    if(datakorelasi[i]._id.toString() == get_genre[k][l].toString() ){
                                                                        get1 = true;
                                                                    }
                                                                    else if(datakorelasi[j]._id.toString() == get_genre[k][l].toString() ){
                                                                        get2 = true;
                                                                    }
                                                                    

                                                                }
                                                                if(get1 == true && get2 == true){
                                                                    doublecount += 1;
                                                                }
                                                            }
                                                            jlh2genre.push([datakorelasi[i].genre_name,datakorelasi[j].genre_name,doublecount])
                                                        }
                                                    }

                                                    var korelasigenre=[]
                                                    
                                                    
                                                   
                                                    
                                                    for(var i =0;i<jlh2genre.length;i++){
                                                        if(jlh2genre[i][0].toString() == jlh2genre[i][1].toString() ){
                                                            korelasigenre.push([jlh2genre[i][0], jlh2genre[i][1], 100 ])
                                                        }
                                                        else{
                                                            var jumlah = 0;
                                                            for(j=0;j<genre.length;j++){
                                                                if(jlh2genre[i][0].toString() == genre[j][0].toString() ){
                                                                    jumlah = genre[j][1];
                                                                }
                                                            }
                                                            korelasigenre.push([jlh2genre[i][0], jlh2genre[i][1], (jlh2genre[i][2]/jumlah)*100 ])
                                                        }
                                                    }
                                                    var userprefrence = []
                                                    
                                                        
                                                        
                                                        userprefrence = ['5b34f1d3f7460b278469cc34', '5b34f1d1f7460b278469cc33', '5b34f1d8f7460b278469cc37']
                                                            
                                                            
                                                            var datarelasi = []
                                                            var recommendationdata = []
                                                    for(var i =0 ;i<get_genre.length;i++){
                                                        var recompoint = 0;
                                                        
                                                        var dataVn = 0;
                                                        getsama = false;
                                                       
                                                        for(var j=0;j<userprefrence.length;j++){
                                                            var beda = 0;
                                                            var sama = 0;
                                                            var vbeda =0
                                                            var vsama = 0
                                                            for(var k=0; k<get_genre[i].length;k++){
                                                                
                                                                if(userprefrence[j].toString() == get_genre[i][k].toString() ){
                                                                    vsama = 100;
                                                                    sama =1;
                                                                    getsama = true;
                                                                    //datarelasi.push(vsama)
                                                                }
                                                                else{
                                                                    for(gen1 = 0 ;gen1<korelasigenre.length;gen1++){
                                                                        if(korelasigenre[gen1][0].toString() == userprefrence[j] && korelasigenre[gen1][1].toString() == get_genre[i][k].toString() ){
                                                                            beda += korelasigenre[gen1][2];
                                                                        }
                                                                    }

                                                                }
                                                                
                                                                //dataVn.push(datarelasi)
                                                            }
                                                            vbeda += beda/(get_genre[i].length-sama)
                                                            dataVn += (vsama + vbeda);
                                                            datarelasi.push({
                                                                datavn : dataVn,
                                                                rating : listgame[i].rating,
                                                                UP : userprefrence.length,
                                                                angkabeda : beda,
                                                                game : listgame[i].game_name
                                                            })

                                                        }
                                                        recompoint = (dataVn*listgame[i].rating)/userprefrence.length;
                                                        recommendationdata.push({id : listgame[i]._id,rp :recompoint,game_name : listgame[i].game_name,photo_url : listgame[i].photo_url,rating : listgame[i].rating,release_date :listgame[i].release_date, harga : listgame[i].harga})
                                                    }
                                                    recommendationdata = recommendationdata.sort(function(a,b){
                                                        return b.rp - a.rp;
                                                    })

                                                    // console.log(listgame[0])
                                                    // console.log(listgame.length)
                                                    // console.log(get_genre.length)
                                                    // console.log(get_genre[0])
                                                    // console.log(recommendationdata)
                                                    // console.log(korelasigenre)
                                                    //console.log(genre)
                                                    // return res.json(korelasigenre)
                                                    // return res.json(korelasigenre)
                                                    res.view('admin/adminfrekuensi',{
                                                        status : 'OK',
                                                        title : 'Korelasi Panel',
                                                        layout : false,
                                                        jlh2genre : jlh2genre,
                                                        genre : genre,
                                                        
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
        }
    })
},



rekomendasi : function(req,res){
    Genre.native(function(err,collection){
        if(err){
            return res.serverError(err);
        }
        else{
            collection.find({},{
                genres : true,
                genre_name : true,
                

            }).toArray(function(err, datakorelasi){
                if(err){
                    return res.serverError(err);
                }
                else{
                    Genrelist.native(function(err, gamegenre){
                        if(err){
                            return res.serverError(err);
                        }
                        else{
                            gamegenre.find({},{
                                game_id : true,
                                genre_id : true,
                            }).toArray(function(err, gamedata){
                                if(err){
                                    return res.serverError(err);
                                }
                                else{
                                    var genre = []
                                    var total = 0;
                                    for(var i = 0;i<datakorelasi.length;i++){
                                        for(var j = i+1 ; j<gamedata.length;j++){
                                            if(gamedata[j].genre_id.toString() == datakorelasi[i]._id.toString()){
                                                total = total + 1 ;
                                            }
                                            
                                        }
                                        genre.push([datakorelasi[i]._id, total])
                                        total = 0;
                                    }
                                    
                                    
                                    Games.native(function(err, gamelist){
                                        if(err){
                                            return res.serverError(err);
                                        }
                                        else{
                                            gamelist.find({},{
                                                game_id : true,
                                                rating : true,
                                                harga : true,
                                                photo_url : true,
                                                game_name : true,
                                                release_date : true,
                                            }).toArray(function(err, listgame){
                                                if(err){
                                                    return res.serverError(err);
                                                }
                                                else{
                                                    //gamedata --> genrelist
                                                    //listgame --> games (247+)
                                                    //datakorelasi --> genre (19)
                                                    //genre --> frekuensi 1 genre
                                                    //getgenre --> list genre setiap game
                                                    
                                                    
                                                    
                                                    var get_genre = []
                                                    for(var i = 0;i<listgame.length;i++){
                                                        var data_arr = []
                                                        // console.log(count)
                                                        var count = 0;
                                                        for(var j = 0 ; j<gamedata.length;j++){
                                                            if(listgame[i]._id.toString() == gamedata[j].game_id.toString() ){
                                                                data_arr.push(gamedata[j].genre_id)
                                                                count += 1;
                                                                
                                                            }
                                                        }
                                                        get_genre.push(data_arr)
                                                    }

                                                    var get_game_genre_name = []
                                                    var temp =[]
                                                    for(var i =0;i<get_genre.length;i++){
                                                            for(var j =0;j<get_genre[i].length;j++){
                                                                for(k =0;k<datakorelasi.length;k++){
                                                                    if(get_genre[i][j].toString() == datakorelasi[k]._id.toString()){
                                                                        temp.push(datakorelasi[k].genre_name)

                                                                    }
                                                                }
                                                     }
                                                    get_game_genre_name.push(temp)
                                                    temp = []
                                                    }
                                                    
                                                    
                                                    var jlh2genre = []
                                                                                                        
                                                    for(var i=0;i<datakorelasi.length;i++){
                                                        for(var j=0;j<datakorelasi.length;j++){
                                                            var doublecount = 0;
                                                            for(k=0;k<listgame.length;k++){
                                                                var get1 = false;
                                                                var get2 = false;
                                                                for(l=0;l<get_genre[k].length;l++){
                                                                    if(datakorelasi[i]._id.toString() == get_genre[k][l].toString() ){
                                                                        get1 = true;
                                                                    }
                                                                    else if(datakorelasi[j]._id.toString() == get_genre[k][l].toString() ){
                                                                        get2 = true;
                                                                    }
                                                                    

                                                                }
                                                                if(get1 == true && get2 == true){
                                                                    doublecount += 1;
                                                                }
                                                            }
                                                            jlh2genre.push([datakorelasi[i]._id,datakorelasi[j]._id,doublecount])
                                                        }
                                                    }

                                                    var korelasigenre=[]
                                                    
                                                    
                                                   
                                                    
                                                    for(var i =0;i<jlh2genre.length;i++){
                                                        if(jlh2genre[i][0].toString() == jlh2genre[i][1].toString() ){
                                                            korelasigenre.push([jlh2genre[i][0], jlh2genre[i][1], 100 ])
                                                        }
                                                        else{
                                                            var jumlah = 0;
                                                            for(j=0;j<genre.length;j++){
                                                                if(jlh2genre[i][0].toString() == genre[j][0].toString() ){
                                                                    jumlah = genre[j][1];
                                                                }
                                                            }
                                                            korelasigenre.push([jlh2genre[i][0], jlh2genre[i][1], (jlh2genre[i][2]/jumlah)*100 ])
                                                        }
                                                    }
                                                    var userprefrence = []
                                                    if(req.session.User){
                                                        console.log('login')
                                                        User.findOne({id : req.session.User.id}).populateAll().exec(function(err, datauser){
                                                            console.log(datauser.genre)
                                                            
                                                            for(var i=0;i<datauser.genre.length;i++){
                                                                userprefrence.push(datauser.genre[i])
                                                            }
                                                            var datarelasi = []
                                                            var recommendationdata = []
                                                    for(var i =0 ;i<get_genre.length;i++){
                                                        var recompoint = 0;
                                                        
                                                        var dataVn = 0;
                                                        getsama = false;
                                                       
                                                        for(var j=0;j<userprefrence.length;j++){
                                                            var beda = 0;
                                                            var sama = 0;
                                                            var vbeda =0
                                                            var vsama = 0
                                                            for(var k=0; k<get_genre[i].length;k++){
                                                                
                                                                if(userprefrence[j].toString() == get_genre[i][k].toString() ){
                                                                    vsama = 100;
                                                                    sama =1;
                                                                    getsama = true;
                                                                    //datarelasi.push(vsama)
                                                                }
                                                                else{
                                                                    for(gen1 = 0 ;gen1<korelasigenre.length;gen1++){
                                                                        if(korelasigenre[gen1][0].toString() == userprefrence[j] && korelasigenre[gen1][1].toString() == get_genre[i][k].toString() ){
                                                                            beda += korelasigenre[gen1][2];
                                                                        }
                                                                    }

                                                                }
                                                                
                                                                //dataVn.push(datarelasi)
                                                            }
                                                            vbeda += beda/(get_genre[i].length-sama)
                                                            dataVn += (vsama + vbeda);
                                                            datarelasi.push({
                                                                datavn : dataVn,
                                                                rating : listgame[i].rating,
                                                                UP : userprefrence.length,
                                                                angkabeda : beda,
                                                                game : listgame[i].game_name
                                                            })

                                                        }
                                                        recompoint = (dataVn*listgame[i].rating)/userprefrence.length;
                                                        recommendationdata.push({id : listgame[i]._id,rp :recompoint,
                                                            genre : get_game_genre_name[i],
                                                            game_name : listgame[i].game_name,photo_url : listgame[i].photo_url,rating : listgame[i].rating,release_date :listgame[i].release_date, harga : listgame[i].harga})
                                                    }
                                                    recommendationdata = recommendationdata.sort(function(a,b){
                                                        return b.rp - a.rp;
                                                    })

                                                    // console.log(listgame[0])
                                                    // console.log(listgame.length)
                                                    // console.log(get_genre.length)
                                                    // console.log(get_genre[0])
                                                    // console.log(recommendationdata)
                                                    // console.log(korelasigenre)
                                                    //console.log(genre)
                                                    // return res.json(korelasigenre)
                                                    Cart.find({user_id : req.session.User.id}).exec(function(err,updatecart){
                                                        Owngame.find({user_id : req.session.User.id}).exec(function(err,owngame){
                                                            console.log(get_genre)
                                                            res.view('admin/adminrekomendasi', {
                                                                status : 'OK',
                                                                title : 'Recommendation',
                                                                layout : false,
                                                                recommendationdata : recommendationdata,
                                                                updatecart : updatecart,
                                                                owngame : owngame,
                                                            })
                                                        })
                                                    })

                                                    })
                                                    }
                                                    else{
                                                        userprefrence = ['5b34f1d3f7460b278469cc34', '5b34f1d1f7460b278469cc33', '5b34f1d8f7460b278469cc37']
                                                        var recommendationdata = []
                                                    for(var i =0 ;i<get_genre.length;i++){
                                                        var recompoint = 0;
                                                        var datarelasi = []
                                                        var dataVn = 0;
                                                        getsama = false;
                                                        for(var j=0;j<userprefrence.length;j++){
                                                            var vsama = 0
                                                            for(var k=0; k<get_genre[i].length;k++){
                                                                var beda = 0;
                                                                var sama = 0;
                                                                if(userprefrence[j].toString() == get_genre[i][k].toString() ){
                                                                    vsama = 100;
                                                                    sama +=1;
                                                                    getsama = true;
                                                                    //datarelasi.push(vsama)
                                                                }
                                                                else{
                                                                    for(gen1 = 0 ;gen1<korelasigenre.length;gen1++){
                                                                        if(korelasigenre[gen1][0].toString() == userprefrence[j] && korelasigenre[gen1][1].toString() == get_genre[i][k].toString() ){
                                                                            beda += korelasigenre[gen1][2];
                                                                        }
                                                                    }
                                                                }
                                                                dataVn += (vsama + (beda/get_genre[i].length-sama));
                                                                //dataVn.push(datarelasi)
                                                            }

                                                        }
                                                        recompoint = (dataVn*listgame[i].rating)/userprefrence.length;
                                                        recommendationdata.push({id : listgame[i]._id,
                                                            genre : get_game_genre_name[i],
                                                            rp :recompoint,game_name : listgame[i].game_name,photo_url : listgame[i].photo_url,rating : listgame[i].rating,release_date :listgame[i].release_date, harga : listgame[i].harga})
                                                    }
                                                    recommendationdata = recommendationdata.sort(function(a,b){
                                                        return b.rp - a.rp;
                                                    })

                                                    // console.log(listgame.length)
                                                    // console.log(get_genre.length)
                                                    // console.log(get_genre[0])
                                                    // console.log(recommendationdata)
                                                    //console.log(datakorelasi)
                                                    //console.log(genre)
                                                    // res.json(recommendationdata)
                                                    res.view('admin/adminrekomendasi', {
                                                        status : 'OK',
                                                        title : 'rekomendasi',
                                                        layout : false,
                                                        recommendationdata : recommendationdata,
                                                        
            
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
            })
        }
    })
}


};

