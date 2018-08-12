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

	checkcartsearch : function(req,res,next){
		Cart.findOne({user_id : req.param('user_id')}).where({id_game : req.param('id_game')}).exec(function(err, usercart){
			
			if(usercart){
				var current_url = req.param('current_url');
		
				console.log('itemfound')
				res.redirect(current_url);
				console.log(current_url)
		
			}
			else{
				var current_url = req.param('current_url');
				console.log('item not found')
				Cart.create(req.body).exec(function(err, newcart){
					if(err){
						return res.serverError(err);
					}
					else{
						
						console.log('cart added')
						res.redirect(current_url);
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
				var geturl = req.param('current_url');
				console.log(geturl)
				console.log('cart deleted')
				res.redirect('/');
			}
		})

		
	},

	removesearch : function(req,res,next){
		Cart.destroy({id : req.param('id')}).exec(function(err, deleteitem){
			if(err){
				return res.serverError(err);
			}
			else{
				var current_url = req.param('current_url')
				console.log('cart deleted')
				res.redirect(current_url);
			}
		})

		
	},

	checkout: function(req,res,next){
		Cart.find({user_id : req.session.User.id}).exec(function(err,updatecart){
			if(err){
				return res.serverError(err);
			}
			else{
				User.findOne({id:req.session.User.id}).exec(function(err,user){
					res.view('user/checkout',{
						status : 'OK',
						title : 'Check Out',
						updatecart : updatecart,
						user : user,
					})
				})
			}
		})
	},

	getCartmobile : function(req,res){
		User.findOne({email : req.param('email')}).exec(function(err,user){
			if(err){
				return res.serverError(err)
			}
			else{
				Cart.find({user_id : user.id}).exec(function(err,cart){
					if(err){
						return res.serverError(err);
					}
					else{
						res.json(cart)
					}
				})
			}
		})
	},

	addcartmobile : function(req,res){
		Cart.create(req.allParams()).exec(function(err, newcart){
			if(err){
				return res.serverError(err);
			}
			else{
				console.log('cart added')
				res.json(newcart)
			}
		})
	}

};

