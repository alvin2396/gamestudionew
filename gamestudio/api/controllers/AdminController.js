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



};

