/**
 * UserMobileController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    mobilelogin : function(req,res){
        var email = req.param('email');
        var password = req.param('password');
    
        if (!email || !password) {
          return res.json(401, {err: 'email and password required'});
        }
    
        User.findOne({email: email}, function (err, user) {
          if (!user) {
            return res.json(401, {err: 'invalid email or password'});
          }
    
          User.comparePassword(password, user, function (err, valid) {
            if (err) {
              return res.json(403, {err: 'forbidden'});
            }
    
            if (!valid) {
              return res.json(401, {err: 'invalid email or password'});
            } else {
              user.jwTString=[]
              user.jwTString.push({
                id: user.id,
                nama : user.nama,
                token: jwToken.issue({id : user.id })

              })
              res.json(200,{
                user: user,
                token: jwToken.issue({id : user.id })
              });
            }
          });
        })
      }

};

