const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const FaqSchema=new Schema({

    pageId:{
      type:String,
      required:true
    },
    faqs:[{answer:String,question:String}]


});

module.exports=mongoose.model('Faq',FaqSchema);