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
      }

};

