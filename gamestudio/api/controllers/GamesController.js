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
                        games.rec_spek = []
                        async.each(games.min_requirement, function (spek, callback) {

                            Spesifikasi.findOne({ id: spek.id }).exec(function (err, min_spek) {

                                if (err) {
                                    callback(err)
                                }
                                else {
                                    if (min_spek.status == 'minimum') {
                                        games.min_spek_intel.push({
                                            processor_id: min_spek.processor_id,
                                            vga_id: min_spek.vga_id,
                                            ram_id: min_spek.ram_id,
                                            status: min_spek.status
                                        })
                                    }
                                    if (min_spek.status == 'recommend') {

                                        games.rec_spek.push({
                                            processor_id: min_spek.processor_id,
                                            vga_id: min_spek.vga_id,
                                            ram_id: min_spek.ram_id,
                                            status: min_spek.status
                                        })
                                    }

                                    callback()
                                }
                            })
                        }, function (err) {


                            if (err) {
                                return res.serverError(err);
                            }
                            else {
                                Ram.findOne({ id: games.min_spek_intel[0].ram_id }).exec(function (err, getRam) {
                                    Ram.findOne({ id: games.rec_spek[0].ram_id }).exec(function (err, recRam) {
                                        Processor.findOne({ id: games.rec_spek[0].processor_id }).exec(function (err, recProc) {
                                            Vga.findOne({ id: games.rec_spek[0].vga_id }).exec(function (err, recVga) {
                                                Processor.findOne({ id: games.min_spek_intel[0].processor_id }).exec(function (err, getProc) {
                                                    Vga.findOne({ id: games.min_spek_intel[0].vga_id }).exec(function (err, getVga) {
                                                        if (req.session.User) {
                                                            User.findOne({ id: req.session.User.id }).exec(function (err, user) {
                                                                Processor.findOne({ id: user.processor_id }).exec(function (err, userprocessor) {
                                                                    Vga.findOne({ id: user.vga_id }).exec(function (err, uservga) {
                                                                        Ram.findOne({ id: user.ram_id }).exec(function (err, userram) {
                                                                            Cart.find({ user_id: req.session.User.id }).exec(function (err, updatecart) {
                                                                                console.log(updatecart)
                                                                                
                                                                                Feature.findOne({game_id : games.id}).exec(function(err, feature){
                                                                                    Rating.find({game_id : games.id}).sort('updatedAt DESC').exec(function(err,review){
                                                                                        review.namauser = []
                                                                                        async.each(review,function(userreview,callback){
                                                                                            User.findOne({id : userreview.user_id}).exec(function(err, datareview){
                                                                                                if(err){
                                                                                                    return res.serverError(err)
                                                                                                }
                                                                                                else{
                                                                                                    review.namauser.push({
                                                                                                        id : datareview.id,
                                                                                                        nama : datareview.nama,
                                                                                                        photo_url : datareview.photo_url,
                                                                                                        review : userreview.review,
                                                                                                        rating : userreview.rating_value
                                                                                                    })
                                                                                                    callback()
                                                                                                }
                                                                                                console.log('datareview')
                                                                                                console.log(review.namauser)
                                                                                            })
                                                                                            
                                                                                        },function(err){
                                                                                            if(err){
                                                                                                return res.serverError(err);
                                                                                            }
                                                                                            else{
                                                                                                Owngame.find({user_id : req.session.User.id}).exec(function(err,owngame){
                                                                                                    
                                                                                                    res.view("user/gameDetail/", {
                                                                                                        status: 'OK',
                                                                                                        title: 'Detail Game',
                                                                                                        games: games,
                                                                                                        getRam: getRam,
                                                                                                        getProc: getProc,
                                                                                                        getVga: getVga,
                                                                                                        recProc: recProc,
                                                                                                        recRam: recRam,
                                                                                                        recVga: recVga,
                                                                                                        uservga: uservga,
                                                                                                        userram: userram,
                                                                                                        userprocessor: userprocessor,
                                                                                                        user: user,
                                                                                                        updatecart: updatecart,
                                                                                                        feature : feature,
                                                                                                        review : review,
                                                                                                        owngame : owngame,
                                                                                                      
                                                                                                    })
                                                                                                })
                                                                                            }
                                                                                        })
                                                                                    })
                                                                                })
                                                                            })
                                                                            if (parseInt(userprocessor.processor_score) >= parseInt(getProc.processor_score) && parseInt(userram.ram_score) >= parseInt(getRam.ram_score) && parseInt(uservga.vga_score) >= parseInt(getVga.vga_score)) {
                                                                                console.log('true')
                                                                            }
                                                                            else {
                                                                                console.log('false')
                                                                                console.log(parseInt(userprocessor.processor_score))
                                                                                console.log(parseInt(getProc.processor_score))
                                                                                if (parseInt(userprocessor.processor_score) < parseInt(getProc.processor_score)) {
                                                                                    console.log('processor low')
                                                                                    console.log(userprocessor.processor_score)
                                                                                    console.log(userprocessor)
                                                                                    console.log(getProc.processor_score)
                                                                                    console.log(getProc)
                                                                                }
                                                                                else if (uservga.vga_score < getVga.vga_score) {
                                                                                    console.log('vga low')
                                                                                    console.log(uservga.vga_score)
                                                                                    console.log(uservga)
                                                                                    console.log(getVga.vga_score)
                                                                                    console.log(getVga)

                                                                                }
                                                                                else if (userram.ram_score < getRam.ram_score) {
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
                                                        else {
                                                            Feature.findOne({game_id : games.id}).exec(function(err, feature){
                                                                if(err){
                                                                    return res.serverError(err)
                                                                }
                                                                else{
                                                                    Rating.find({game_id : games.id}).sort('updatedAt DESC').exec(function(err,review){
                                                                        review.namauser = []
                                                                        async.each(review,function(userreview,callback){
                                                                            User.findOne({id : userreview.user_id}).exec(function(err, datareview){
                                                                                if(err){
                                                                                    return res.serverError(err)
                                                                                }
                                                                                else{
                                                                                    review.namauser.push({
                                                                                        id : datareview.id,
                                                                                        nama : datareview.nama,
                                                                                        photo_url : datareview.photo_url,
                                                                                        review : userreview.review,
                                                                                        rating : userreview.rating_value
                                                                                    })
                                                                                    callback()
                                                                                }
                                                                                console.log('datareview')
                                                                                console.log(review.namauser)
                                                                            })
                                                                            
                                                                        },function(err){
                                                                            if(err){
                                                                                return res.serverError(err);
                                                                            }
                                                                            else{
                                                                                console.log(review)
                                                                                res.view("user/gameDetail/", {
                                                                                    status: 'OK',
                                                                                    title: 'Detail Game',
                                                                                    games: games,
                                                                                    getRam: getRam,
                                                                                    getProc: getProc,
                                                                                    getVga: getVga,
                                                                                    recProc: recProc,
                                                                                    recRam: recRam,
                                                                                    recVga: recVga,
                                                                                    feature : feature,
                                                                                    review : review,
                                                                                  
                                                                                })
                                                                            }
                                                                        })
                                                                    })
                                                                }
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



    updatetgal: function (req, res) {
        var gameObj = {
            release_date: req.param('release_date')
        }

        Games.update(req.param('id'), gameObj, function (err, updated) {
            if (err) {
                return res.serverError(err);
            }
            else {
                return res.json(updated);
            }

        })
    },

    updatespeks: function (req, res, next) {
        var gameObj = {
            OS: req.param('OS'),
            HDD_space: req.param('HDD_space'),
        }

        Games.update(req.param('id'), gameObj, function (err, updated) {
            if (err) {
                return res.serverError(err);
            }
            else {
                return res.json(updated);
            }

        })
    },

    updatespesifikasi: function (req, res) {
        res.view('admin/updatespek')
    },

    checkdataspek: function (req, res) {
        var spek = []
        var spek_rec = []
        Games.findOne({ id: '5b376c7400217d253ccd2d73' }).exec(function (err, amd) {
            if (err) {
                return res.serverError(err);
            }
            else {
                console.log(amd);

                Spesifikasi.findOne({ id: amd.min_requirement }).exec(function (err, Spesifikasi_min) {
                    if (err) {
                        return res.serverError(err);
                    }
                    else {
                        console.log(amd.min_requirement);
                        Spesifikasi.findOne({ id: amd.recommended_requirement }).exec(function (err, spesifikasi_rec) {
                            if (err) {
                                return res.serverError(err);
                            }
                            else {
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

    populargame: function (req, res, next) {
        var perPage = 21
        if (!req.params.page) {
            var page = 1
        }
        else {
            var page = req.params.page
        }
        Games.find().sort('rating DESC')
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .populateAll().exec(function (err, games_popular) {
                Games.count().exec(function (err, count) {
                    if (err) {
                        return res.serverError(err);
                    }
                    else {
                        if (req.session.User) {
                            Cart.find({ user_id: req.session.User.id }).exec(function (err, updatecart) {
                                Owngame.find({user_id : req.session.User.id}).exec(function(err,owngame){
                                    res.view('user/popularGame', {
                                        status: 'OK',
                                        title: 'Popular Games',
                                        games_popular: games_popular,
                                        current: page,
                                        pages: Math.ceil(count / perPage),
                                        updatecart: updatecart,
                                        owngame : owngame,
                                    })
                                })
                            })
                        }
                        else {
                            res.view('user/popularGame', {
                                status: 'OK',
                                title: 'Popular Games',
                                games_popular: games_popular,
                                current: page,
                                pages: Math.ceil(count / perPage)
                            })
                        }
                    }
                })
            })
    },

    populargameMobile: function (req, res, next) {
        var item_count = req.param('item_count')
        var page_number = req.param('page_number')
        Games.find().sort('rating DESC')
            .skip((item_count * page_number) - item_count)
            .limit(item_count)
            .exec(function (err, games_popular) {
                    Games.count().exec(function (err, count) {
                        if (err) {
                            return res.serverError(err);
                        }
                        else {
                            return res.json(games_popular);
                        }
                    })
                })
    },


    newgameMobile: function (req, res, next) {
        var item_count = req.param('item_count')
        var page_number = req.param('page_number')
        Games.find().sort('release_date DESC')
            .skip((item_count * page_number) - item_count)
            .limit(item_count)
            .exec(function (err, games_new) {
                    Games.count().exec(function (err, count) {
                        if (err) {
                            return res.serverError(err);
                        }
                        else {
                            return res.json(games_new);
                        }
                    })
                })
    },

    newgame: function (req, res, next) {
        var perPage = 21
        if (!req.params.page) {
            var page = 1
        }
        else {
            var page = req.params.page
        }
        Games.find().sort('release_date DESC')
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .populateAll().exec(function (err, new_game) {
                Games.count().exec(function (err, count) {
                    if (err) {
                        return res.serverError(err);
                    }
                    else {
                        if (req.session.User) {
                            Cart.find({ user_id: req.session.User.id }).exec(function (err, updatecart) {
                                Owngame.find({user_id : req.session.User.id}).exec(function(err, owngame){
                                    res.view('user/newGame', {
                                        status: 'OK',
                                        title: 'New Games',
                                        new_game: new_game,
                                        current: page,
                                        pages: Math.ceil(count / perPage),
                                        updatecart: updatecart,
                                        owngame : owngame,
                                    })
                                })
                            })
                        }
                        else {
                            res.view('user/newGame', {
                                status: 'OK',
                                title: 'New Games',
                                new_game: new_game,
                                current: page,
                                pages: Math.ceil(count / perPage)
                            })
                        }
                    }
                })
            })
    },

    gamePopular: function (req, res) {

        Games.find().sort('rating DESC').limit(8).populateAll().exec(function (err, games) {
            if (err)
                return res.serverError(err);
            else {
                games.genreStrings = []
                games.userStrings = []
                async.each(games.genre_lists, function (genre, callback) {
                    Genre.findOne({ id: genre.genre_id }).exec(function (err, genres) {
                        if (err) {
                            callback(err)
                        }
                        else {
                            games.genreStrings.push({
                                id: genres.id,
                                nama_genre: genres.genre_name
                            })
                            callback()
                        }
                    })
                }, function (err) {
                    if (err) {
                        return res.serverError(err);
                    }
                    else {
                        Games.find().sort('release_date DESC').limit(8).exec(function (err, newgame) {
                            if (err) {
                                return res.serverError(err);
                            }
                            else {
                                Games.find().populateAll().exec(function (err, listgame) {
                                    if (err) {
                                        return res.serverError(err);
                                    }
                                    else {
                                        Games.find().sort('rating DESC').limit(6).populateAll().exec(function (err, limitgames) {
                                            if (err) {
                                                return res.serverError(err);
                                            }
                                            else {
                                                Games.find().sort('release_date DESC').limit(6).populateAll().exec(function (err, limitnew) {
                                                    if (err) {
                                                        return res.serverError(err);
                                                    }
                                                    else {

                                                        if (req.session.User) {
                                                            console.log('log in')
                                                            User.findOne({ id: req.session.User.id }).exec(function (err, user) {
                                                                if (err) {
                                                                    return res.serverError(err);
                                                                }
                                                                else {

                                                                    Cart.find({ user_id: req.session.User.id }).exec(function (err, updatecart) {
                                                                        if (err) {
                                                                            return res.serverError(err);
                                                                        }
                                                                        else {
                                                                            Genre.native(function (err, collection) {
                                                                                if (err) {
                                                                                    return res.serverError(err);
                                                                                }
                                                                                else {
                                                                                    collection.find({}, {
                                                                                        genres: true,
                                                                                        genre_name: true,


                                                                                    }).toArray(function (err, datakorelasi) {
                                                                                        if (err) {
                                                                                            return res.serverError(err);
                                                                                        }
                                                                                        else {
                                                                                            Genrelist.native(function (err, gamegenre) {
                                                                                                if (err) {
                                                                                                    return res.serverError(err);
                                                                                                }
                                                                                                else {
                                                                                                    gamegenre.find({}, {
                                                                                                        game_id: true,
                                                                                                        genre_id: true,
                                                                                                    }).toArray(function (err, gamedata) {
                                                                                                        if (err) {
                                                                                                            return res.serverError(err);
                                                                                                        }
                                                                                                        else {
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
                                                                                                                                                                User.findOne({id : req.session.User.id}).populateAll().exec(function(err, datauser){
                                                                                                                                                                    console.log(datauser.genre)
                                                                                                                                                                    
                                                                                                                                                                    for(var i=0;i<datauser.genre.length;i++){
                                                                                                                                                                        userprefrence.push(datauser.genre[i])
                                                                                                                                                                    }
                                                                                                                                                                    var recommendationdata = []
                                                                                                                                                                    var datarelasi = []
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
                                                                                                                                                            var homerekomendasi = [];
                                                                                                                                                            for(var i =0;i<9;i++){
                                                                                                                                                                homerekomendasi.push(recommendationdata[i])
                                                                                                                                                            }
                                                                                                            
                                                                                                                                                            // console.log(listgame[0])
                                                                                                                                                            // console.log(listgame.length)
                                                                                                                                                            // console.log(get_genre.length)
                                                                                                                                                            // console.log(get_genre[0])
                                                                                                                                                            // console.log(recommendationdata)
                                                                                                                                                            //console.log(datakorelasi)
                                                                                                                                                            //console.log(genre)
                                                                                                                                                            // return res.json(recommendationdata)
                                                                                                                                                            // console.log(homerekomendasi[0])
                                                                                                                                                            Owngame.find({user_id : req.session.User.id}).exec(function(err,owngame){
                                                                                                                                                                res.view('homepage', {
                                                                                                                                                                    status: 'OK',
                                                                                                                                                                    title: 'Game Studio',
                                                                                                                                                                    games: games,
                                                                                                                                                                    newgame: newgame,
                                                                                                                                                                    listgame: listgame,
                                                                                                                                                                    limitgames: limitgames,
                                                                                                                                                                    limitnew: limitnew,
                                                                                                                                                                    user: user,
                                                                                                                                                                    updatecart: updatecart,
                                                                                                                                                                    homerekomendasi : homerekomendasi,
                                                                                                                                                                    owngame : owngame,
                                                                                                                                                                })
                                                                                                                                                            })
                                                                                                            
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
                                                        else {
                                                            console.log('not log in')
                                                            res.view('homepage', {
                                                                status: 'OK',
                                                                title: 'Game Studio',
                                                                games: games,
                                                                newgame: newgame,
                                                                listgame: listgame,
                                                                limitgames: limitgames,
                                                                limitnew: limitnew
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
        var perPage = 15
            if (!req.param('page')) {
                var page = 1
            }
            else {
                var page = req.param('page')
            }
        if(req.session.User){
            
            Games.find({ like: { game_name: '%' + req.param('search') + '%' } })
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function (err, search) {
                if (err) {
                    return res.serverError(err);
                }
                else {
                    Cart.find({user_id : req.session.User.id}).exec(function(err, updatecart){
                        Owngame.find({user_id : req.session.User.id}).exec(function(err, owngame){
                            Games.count({ like: { game_name: '%' + req.param('search') + '%' } }).exec(function (err, count){
                                res.view("user/search/", {
                                    status: 'OK',
                                    title: 'Search Result',
                                    search: search,
                                    updatecart : updatecart,
                                    owngame : owngame,
                                    current: page,
                                    pages: Math.ceil(count / perPage)
                                })
                            })
                            
                        })
                    })
                }


            })
        }
        else{
         
            Games.find({ like: { game_name: '%' + req.param('search') + '%' } })
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function (err, search) {
                if (err) {
                    return res.serverError(err);
                }
                else {
                    Games.count({ like: { game_name: '%' + req.param('search') + '%' } }).exec(function (err, count){
                        console.log(search.length)
                        res.view("user/search/", {
                            status: 'OK',
                            title: 'Search Result',
                            search: search,
                            current: page,
                            pages: Math.ceil(count / perPage)
                        })
                    })
                    
                }


            })
        }
    },

    genre : function(req,res){
        if(req.session.User){
            Genrelist.find({genre_id : req.param('genre_id')}).populateAll().exec(function(err,sortgenre){
                if(err){
                    return res.serverError(err);
                }
                else{
                    sortgenre.datagame = []
                    async.each(sortgenre,function(datagenre,callback){
                        Games.findOne({id : datagenre.game_id.id}).sort('rating DESC').exec(function(err, datagame){
                            sortgenre.datagame.push({
                                id : datagame.id,
                                game_name : datagame.game_name,
                                photo_url : datagame.photo_url,
                                release_date : datagame.release_date,
                                rating : datagame.rating,
                                harga : datagame.harga,
                                genre : req.param('namagenre')
                               
                            })
                            callback()
                        })
                    },function(err){
                        if(err){
                            return res.serverError(err);
                        }
                        else{
                            
                            Cart.find({user_id : req.session.User.id}).exec(function(err, updatecart){
                                Owngame.find({user_id : req.session.User.id}).exec(function(err, owngame){
                                    res.view("user/genregame", {
                                        status : 'OK',
                                        title : req.param('namagenre'),
                                        sortgenre : sortgenre,
                                        updatecart : updatecart,
                                        owngame : owngame,
                                    })
                                })
                            })
                        }
                    })
                }
            })
        }
        else{
            Genrelist.find({genre_id : req.param('genre_id')}).populateAll().exec(function(err,sortgenre){
                if(err){
                    return res.serverError(err);
                }
                else{
                    sortgenre.datagame = []
                    async.each(sortgenre,function(datagenre,callback){
                        Games.findOne({id : datagenre.game_id.id}).sort('rating DESC').exec(function(err, datagame){
                            sortgenre.datagame.push({
                                id : datagame.id,
                                game_name : datagame.game_name,
                                photo_url : datagame.photo_url,
                                release_date : datagame.release_date,
                                rating : datagame.rating,
                                harga : datagame.harga,
                                genre : req.param('namagenre')
                               
                            })
                            callback()
                        })
                    },function(err){
                        if(err){
                            return res.serverError(err);
                        }
                        else{
                            res.view("user/genregame", {
                                status : 'OK',
                                title : req.param('namagenre'),
                                sortgenre : sortgenre,
                            })
                        }
                    })
                }
            })
        }
    },


    searchlist: function (req, res, next) {

        Games.find().populateAll().exec(function (err, listgame) {
            if (err) {
                return res.serverError(err);
            }
            else {
                listgame.arr = []
                async.each(listgame.game_name, function (gamearr, callback) {
                    if (err) {
                        callback(err)
                    }
                    else {
                        listgame.arr.push({
                            game_name: gamearr.game_name
                        })
                        callback()
                    }
                })
                res.view("user/autocomplete", {
                    status: 'OK',
                    title: 'tes search',
                    listgame: listgame
                })
            }
        })
    },

    detailGameMobile: function (req, res, next) {

        Games.findOne(req.param('id')).exec(function (err, games) {
            if (err) {
                return res.serverError(err);
            }
            else {
                res.json(games)
            }
        })
    },

    add: function (req, res) {
        res.view('admin/addGame')
    },

    gamesspesifikasi : function(req,res){
        Spesifikasi.findOne({game_id : req.param('id')}).where({status : req.param('status')}).exec(function(err, spekgame){
            console.log(spekgame)
            if(err){
                return res.serverError(err);
            }
            else{
                res.json(spekgame)
            }
        })
    },

    detailmobilegenre : function(req,res){
        Genrelist.find({game_id : req.param('game_id')}).exec(function(err,detailgenre){
            detailgenre.datagenre = []
            console.log(detailgenre)
            async.each(detailgenre, function(genre,callback){
                console.log(detailgenre.genre_id)
                if(err){
                    return res.serverError(err);
                }
                else{
                    Genre.findOne({id : genre.genre_id}).exec(function(err, findgenre){
                        var namagenre = findgenre.genre_name
                        detailgenre.datagenre.push({
                           nama_genre : findgenre.genre_name,
                           id : findgenre.id
                        })
                        callback()
                    })
                }
            },function(err){
                if(err){
                    return res.serverError(err);
                }
                else{
                    res.json(detailgenre.datagenre)
                }
            })
        })
    }



};

