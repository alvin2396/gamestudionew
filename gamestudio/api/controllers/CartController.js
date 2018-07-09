/**
 * CartController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
	create : function(req,res,next){
		Cart.create(req.body).exec(function(err, newcart){
			if(err){
				return res.serverError(err);
			}
			else{
				res.redirect('localhost:1337');
			}
		})
	}
};

