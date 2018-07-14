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
    User.findOne({id: req.session.User.id}).exec(function(err,userProfil){
      if(err){
        console.log(err);
      }
      else{
        Vga.find().sort('vga_name ASC').exec(function(err,vga){
          Ram.find().sort('ram_score ASC').exec(function(err,ram){
            Processor.find().sort('processor_name ASC').exec(function(err,processor){
              Genre.find().sort('genre_name ASC').exec(function(err, genre){
                Vga.findOne({id:userProfil.vga_id}).exec(function(err,uservga){
                  Ram.findOne({id:userProfil.ram_id}).exec(function(err,userram){
                    Processor.findOne({id:userProfil.processor_id}).exec(function(err,userprocessor){
                        Cart.find({user_id : userProfil.id}).exec(function(err,updatecart){
                          console.log(updatecart)
                          return res.view('user/profile',{
                            status: 'OK',
                            title: 'Profil',
                            userProfil: userProfil,
                            vga:vga,
                            ram:ram,
                            processor,
                            genre : genre,
                            uservga : uservga,
                            userram : userram,
                            userprocessor : userprocessor,
                            updatecart : updatecart,
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
      genre1: req.param('genre1'),
      genre2: req.param('genre2'),
      genre3: req.param('genre3'),
      genre4: req.param('genre4'),
      ram_id : req.param('ram_id'),
      processor_id : req.param('processor_id'),
      vga_id : req.param('vga_id'),
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
    .upload({ dirname: '../../assets/image/user' }, function(err, uploads) {
      // try to always handle errors
      if (err) { return res.serverError(err) }
      // uploads is an array of files uploaded 
      // so remember to expect an array object
      if (uploads.length === 0) { return res.badRequest('No file was uploaded') }
      // if file was uploaded create a new registry
      // at this point the file is phisicaly available in the hard drive
      var id =User.id;
      var photo = User.photo;
      var fd = uploads[0].fd;
      var nameImage = fd.substring(124)
      
      User.update({id:req.param('id')}
                ,
                {photo_url: nameImage
              }).exec(function(err, file) {
                if (err) { return res.serverError(err) }
                // if it was successful return the registry in the response
                res.redirect('/user/profile/' + req.param('id'));
    })
    })
    
},
  
  
  
  create:function(req,res,next){
    User.findOneByEmail(req.param('email'),function(err,user){
      if(user){
        var emailAlready = [
          'Email sudah terdaftar. gunakan email lain untuk mendaftar'
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
              'Email sudah berhasil didaftar. Silahkan Login'
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
    Transaksi.findOne({user_id : req.session.User.id}).where({status : 'pending'}).exec(function(err, transaksi){
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
    Transaksi.findOne({user_id : req.session.User.id}).where({status : 'pending'}).exec(function(err, transaksi){
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
                        'Top Up Berhasil'
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

  
}