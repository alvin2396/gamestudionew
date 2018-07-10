/**
 * CartController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

	checkcart : function(req,res,next){
		Cart.findOne({user_id : req.param('user_id')}).where({id_game : req.param('id_game')}).exec(function(err, usercart){
			if(usercart){
				console.log('itemfound')
				res.redirect('/');
			}
			else{
				console.log('item not found')
				Cart.create(req.body).exec(function(err, newcart){
					if(err){
						return res.serverError(err);
					}
					else{
						console.log('cart added')
						res.redirect('/');
					}
				})
			}
		})
	},

	remove : function(req,res,next){
		Cart.destroy({id : req.param('id')}).exec(function(err, deleteitem){
			if(err){
				return res.serverError(err);
			}
			else{
				console.log('cart deleted')
				res.redirect('/');
			}
		})

		
	}

};

