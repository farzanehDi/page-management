const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const options={
    type:String,
    required:true
};

const RelatedServicesSchema=new Schema({

    pageId:{
        type:String
    },
    relatedServices:[{
        title:options,
        link:options,
        image:options,
    }]


});

module.exports=mongoose.model('RelatedServices',RelatedServicesSchema);