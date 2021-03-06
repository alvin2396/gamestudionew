/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var bcrypt = require('bcrypt')
module.exports = {
  add:function(req,res){
    res.view('admin/addUser')
  },
  

  userProfile:function(req,res,next){
    User.findOne({id: req.session.User.id}).populateAll().exec(function(err,userProfil){
      if(err){
        console.log(err);
      }
      else{
        var genrename = [];
        Vga.find().sort('vga_name ASC').exec(function(err,vga){
          Ram.find().sort('ram_score ASC').exec(function(err,ram){
            Processor.find().sort('processor_name ASC').exec(function(err,processor){
              Genre.find().sort('genre_name ASC').exec(function(err, genre){
                Cart.find({user_id : userProfil.id}).exec(function(err,updatecart){
                  User.findOne({id:req.session.User.id}).exec(function(err, user){
                    Processor.findOne({id:user.processor_id}).exec(function(err,userprocessor){
                      Vga.findOne({id:user.vga_id}).exec(function(err,uservga){
                        Ram.findOne({id:user.ram_id}).exec(function(err,userram){
                          
                            Genre.find({id : user.genre}).exec(function(err, getgenre){
                              if(err){
                                return res.serverError(err);
                              }
                              else{
                                
                                
                                
                                return res.view('user/profile',{
                                  status: 'OK',
                                  title: 'Profil',
                                  userProfil: userProfil,
                                  user : user,
                                  vga:vga,
                                  ram:ram,
                                  processor,
                                  genre : genre,
                                  userprocessor : userprocessor,
                                  uservga : uservga,
                                  userram : userram,
                                  updatecart : updatecart,
                                  getgenre : getgenre,
                                  })
                              }
                            })
                          
                            
                          
                        })
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
  editProfile:function(req,res,next){
    User.findOne(req.param('id'),function(err,editProfile){
      if(err){
        console.log(err);
      }
      else{
        return res.view('user/edit-profile',{
          status: 'OK',
          title: 'Edit Profil',
          editProfile: editProfile
        })
      }
    })
  },
  updateProfile:function(req,res,next){
    var userObj = {
      nama: req.param('nama'),
      alamat: req.param('alamat'),
      genre : req.param('genre')
    }
    
    
      User.update(req.param('id'),userObj,function(err){
      
        if(err){
          console.log(err);
        }
        else{
          var ubahSuccess = [
            'Profile updated!',
          ]
          req.session.flash = {
            err: ubahSuccess
          // If error redirect back to sign-up page
          }
          res.redirect('/user/profile/' + req.param('id'));
        }
      })
    
  },

  updateSpek:function(req,res,next){
    var userObj = {
      ram_id : req.param('ram_id'),
      processor_id : req.param('processor_id'),
      vga_id : req.param('vga_id'),
    }
    

      User.update(req.param('id'),userObj,function(err){
      
        if(err){
          console.log(err);
        }
        else{
          console.log('spek updated')
          var ubahSuccess = [
            'Profile updated!',
          ]
          req.session.flash = {
            err: ubahSuccess
          // If error redirect back to sign-up page
          }
          res.redirect('/user/profile/' + req.param('id'));
        }
      })
    
  },

  updateProfilPassword:function(req,res,next){
    User.findOne(req.param('id'), function(err,pass){
      if(err){
        console.log(err)
      }
      else{
        bcrypt.compare(req.param('password_lama'), pass.password, function(err, valid) {
          if (err) return next(err);
  
          // If the password from the form doesn't match the password from the database...
          if (!valid) {
            var usernamePasswordMismatchError = [
              "Password Lama Anda salah"
            ]
            req.session.flash = {
              err: usernamePasswordMismatchError
            }
            res.redirect('/user/profile/' + req.param('id'));
            return;
          }
          else{
            var passbaru 
            bcrypt.genSalt(10, function(err, salt) {
              bcrypt.hash(req.param('password_baru'), salt, function(err, hash) {
                if(err) {
                    console.log(err);     
                } else {
                  var passObj={
                      password : hash
                    }
                  User.update(req.param('id'),passObj,function(err){
    
                          if(err){
                            console.log(err);
                          }
                          else{
                            var ubahPass = [
                              'Password berhasil diubah',
                            ]
                            req.session.flash = {
                              err: ubahPass
                            // If error redirect back to sign-up page
                            }
                            res.redirect('/user/profile/' + req.param('id'));
                          }
                    })    
                }
              });
            });
          }
        })
      }
    })
  },
  uploadPhotoProfil: function(req, res) {

    req.file('photo_url') // this is the name of the file in your multipart form
    .upload({ dirname: '../../assets/images/user' }, function(err, uploads) {
      // try to always handle errors
      if (err) { return res.serverError(err) }
      // uploads is an array of files uploaded 
      // so remember to expect an array object
      if (uploads.length === 0) { return res.badRequest('No file was uploaded') }
      // if file was uploaded create a new registry
      // at this point the file is phisicaly available in the hard drive
      var id =req.session.User.id;
      var photo = User.photo;
      var fd = uploads[0].fd;
      var replacement = "/";
      var nameImage = fd.substring(50,103).replace(/\\/g,replacement)
      console.log(nameImage)

      var userObj = {
       photo_url : nameImage,
      }
      User.update(req.param('id'),userObj,function(err){
      
      User.update({id:id}
                ,
                {photo_url: nameImage
              }).exec(function(err, file) {
                if (err) { return res.serverError(err) }
                // if it was successful return the registry in the response
                res.redirect('user/profile/' +id);
    })
      
    })
    
    
})},
  
  
  
  create:function(req,res,next){
    User.findOneByEmail(req.param('email'),function(err,user){
      if(user){
        var emailAlready = [
          'Email already used'
        ]
        req.session.flash = {
          err: emailAlready
        }
        res.redirect('/register');
        return
      }
      else{
        User.create(req.body).exec(function(err,user){
          if (err) {
            console.log(err);
            
            }
          else{
            var daftarSuccess = [
              'Email registered. please Login'
            ]
            req.session.flash = {
              err: daftarSuccess
            // If error redirect back to sign-up page
            }
            res.redirect('/login');
            return;
          }
            
        })
      }
    })
  },

  topup:function(req,res,next){
    Cart.find({user_id : req.session.User.id}).exec(function(err, updatecart){
      var id =req.session.User.id;
      console.log(id)
      res.view('user/topup',{
        status : 'OK',
        title : 'Top Up',
        updatecart : updatecart,
      })
    })
    
  },

  topupcreate : function(req,res){
    Transaksi.create(req.body).exec(function(err, new_transaksi){
      if(err){
        return res.serverError(err);
      }
      else{
        res.redirect('/user/topupcheckout')
      }
    })
  },

  topupcheckout : function(req,res,next){
    Transaksi.findOne({user_id : req.session.User.id}).where({status : 'pending'}, {typetransaction : 'topup'}).sort({createdAt: 'DESC'}).exec(function(err, transaksi){
      if(err){
        return res.serverError(err);
      }
      else{
        console.log(transaksi)
        Cart.find({user_id : req.session.User.id}).exec(function(err, updatecart){
          res.view('user/topupconfirm', {
            status : 'OK',
            title : 'Confirmation Order',
            transaksi : transaksi,
            updatecart : updatecart,
          })
        })
        
      }
    })
  },
  
  validatecode : function(req,res,next){
    Transaksi.findOne({user_id : req.session.User.id}).where({status : 'pending'}, {typetransaction : 'topup'}).sort({createdAt: 'DESC'}).exec(function(err, transaksi){
      if(transaksi.confirmation_code == req.param('confirmation_code')){
        var transaksiObj = {
          status: 'complete',
        }
          Transaksi.update(transaksi.id,transaksiObj,function(err){
            if(err){
              console.log(err);
            }
            else{
              User.findOne({id : req.session.User.id}).exec(function(err, user){
                var userObj = {
                  wallet : parseInt(transaksi.total),
                }
                if(typeof(user.wallet) == 'undefined' ){
                  User.update(req.session.User.id, userObj, function(err){
                    if(err){
                      return res.serverError(err);
                    }
                    else{
                      var topupSuccess = [
                        'Top Up Berhasil'
                      ]
                      req.session.flash = {
                        err: topupSuccess
                      }
                      res.redirect('/user/profile/'+req.session.User.id)
                    }
                  })
                }
                else{
                  var total = parseInt(user.wallet) + parseInt(transaksi.total);
                  var userObj2 = {
                    wallet : parseInt(total),
                  }
                  User.update(req.session.User.id, userObj2, function(err){
                    if(err){
                      return res.serverError(err);
                    }
                    else{
                      var topupSuccess = [
                        'Top Up Success'
                      ]
                      req.session.flash = {
                        err: topupSuccess
                      }
                      res.redirect('/user/profile/'+req.session.User.id)
                    }
                  })
                }
              })
            }
          })
      }
      else{
        console.log('wrong code')
        var code_wrong = [
          'Confirmation Code not Match'
        ]
        req.session.flash = {
          err : code_wrong
        }
        
        res.redirect('/user/topupcheckout')
      }

    })
  },

  gamebuy : function(req,res){
    User.findOne({id : req.session.User.id}).exec(function(err,user){
      Cart.find({user_id : user.id}).exec(function(err, usercart){
        async.each(usercart,function(datacart,callback){
          Owngame.create({user_id : user.id, game_id : datacart.id_game}).exec(function(err, owngame){
            if(err){
              return res.serverError(err);
            }
            else{
              callback()
              
            }
          })
        },function(err){
          if(err){
            return res.serverError(err);
          }
          else{
            var total = req.param('totalinput');
            var userObj2 = {
              wallet : (parseFloat(user.wallet) - parseFloat(total)).toString(),
            }
            User.update(user.id,userObj2,function(err){
              if(err){
                return res.serverError(err);
              }
              else{
                var topupSuccess = [
                  'Transaction Successful'
                ]
                req.session.flash = {
                  err: topupSuccess
                }
                Cart.destroy({user_id : req.session.User.id}).exec(function(err, deletecart){
                  if(err){
                    return res.serverError(err);
                  }
                  else{
                    res.redirect('/user/profile/'+user.id)
                  }
                })
              }
            })
            
          }
        })
      })


    })
  },

  mobilelogin : function(req,res){
    var email = req.param('email');
    var password = req.param('password');

    if(!email || !password){
      return res.json(401,{err: 'email and password required'});
    }
    User.findOne({email : email}),function(err, user){
      if(!user){
        return res.json(401, {err: 'email and password invalid'});
      }
       User.comparePassword(password, user, function(err, valid){
         if(err){
           return res.json(403, {err : 'forbidden'});
         }
         else{
            if(!valid){
              return res.json(401, {err: 'email and password invalid'});
            }
            else{
              res.json({
                user : user,
              })
            }
         }
       })
    }
  },

  UserprofileMobile: function(req, res, next){
    var email = req.param('email')
    User.findOne({email:email}).populateAll().exec(function(err,user){
        if (err) {
            return res.serverError(err);
          }
          if (!user) {
            return res.notFound('Could not find email, sorry.');
          }
        
          //sails.log('Found "%s"', finn.fullName);
          
            res.json(user)
        });
        
    },

    Userprocessor : function(req,res,next){
      var email = req.param('email')
      User.findOne({email:email}).populateAll().exec(function(err,user){
        if (err) {
            return res.serverError(err);
          }
          else{
            res.json(user.processor_id)
          }
          
        });
    },

    Uservga : function(req,res,next){
      var email = req.param('email')
      User.findOne({email:email}).populateAll().exec(function(err,user){
        if (err) {
            return res.serverError(err);
          }
          else{
            res.json(user.vga_id)
          }
          
        });
    },

    Userram : function(req,res,next){
      var email = req.param('email')
      User.findOne({email:email}).populateAll().exec(function(err,user){
        if (err) {
            return res.serverError(err);
          }
          else{
            res.json(user.ram_id)
          }
          
        });
    },

    Usergenre : function(req,res,next){
      var email = req.param('email')
      var genrelist = []
      User.findOne({email:email}).populateAll().exec(function(err,usergenre){
        if(err){
          return res.serverError(err);
        }
        else{
          async.each(usergenre.genre,function(datagenre,callback){
            Genre.findOne({id:datagenre}).exec(function(err,getgenre){
              if(err){
                return res.serverError(err);
              }
              else{
                genrelist.push({nama_genre : getgenre.genre_name,
                  id : getgenre.id
                })
                callback()
              }
            })
          },function(err){
            if(err){
              return res.serverError(err)
            }
            else{
              res.json(genrelist)
            }
          })
          
        }
      })
    },

    updateprofileMobile: function(req, res, next){
      User.update(req.param('id'),req.params.all(), function userUpdated(err,user){
          if(err){
              return res.redirect('/user/' + req.param('id'));
          }
    if(user)
      res.json(user);
      });
  },

  updatespekMobile: function(req, res, next){
    User.update(req.param('id'),req.params.all(), function userUpdated(err,user){
        if(err){
            return res.redirect('/user/' + req.param('id'));
        }
  if(user)
    res.json(user);
    });
},

topupcreateMobile : function(req,res){
  Transaksi.create(req.body).exec(function(err, new_transaksi){
    if(err){
      return res.serverError(err);
    }
    else{
      res.json(new_transaksi);
    }
  })
},

validatecodemobile : function(req,res,next){
  Transaksi.findOne({id : req.param('transaksi_id')}).exec(function(err, transaksi){
    console.log(transaksi)
    if(transaksi.confirmation_code == req.param('confirmation_code')){
      var transaksiObj = {
        status: 'complete',
      }
        Transaksi.update(transaksi.id,transaksiObj,function(err){
          if(err){
            console.log(err);
          }
          else{
            User.findOne({email : req.param('email')}).exec(function(err, user){
              var userObj = {
                wallet : parseInt(transaksi.total).toString(),
              }
              if(typeof(user.wallet) == 'undefined' ){
                User.update(user.id, userObj, function(err){
                  if(err){
                    return res.serverError(err);
                  }
                  else{
                    var topupSuccess = [
                      'Top Up Berhasil'
                    ]
                    req.session.flash = {
                      err: topupSuccess
                    }
                    res.json(user)
                  }
                })
              }
              else{
                var total = (parseInt(user.wallet) + parseInt(transaksi.total)).toString();
                var userObj2 = {
                  wallet : total,
                }
                User.update(user.id, userObj2, function(err){
                  if(err){
                    return res.serverError(err);
                  }
                  else{
                    var topupSuccess = [
                      'Top Up Success'
                    ]
                    req.session.flash = {
                      err: topupSuccess
                    }
                    res.json(user)
                  }
                })
              }
            })
          }
        })
    }
    else{
      console.log('wrong code')
      var code_wrong = [
        'Confirmation Code not Match'
      ]
      req.session.flash = {
        err : code_wrong
      }
      
      res.redirect('/user/topupcheckout')
    }

  })
}

  
}