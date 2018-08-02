/**
 * ProcessorController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    add:function(req,res){
        res.view('admin/addProcessor')
    },

    getprocesssor : function(req,res){
        Processor.find().sort('processor_name ASC').exec(function(err, processor){
            if(err){
                return res.serverError(err);
            }
            else{
                return res.json(processor);
            }
        })
    }


};

