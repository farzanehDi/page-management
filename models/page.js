const mongoose=require('mongoose');
const Schema=mongoose.Schema;


// const FaqSchema=new Schema({
//
//     question:{
//         type:String,
//     },
//     answer:{
//         type:String,
//     },
//
// });


const PageSchema=new Schema({

    url:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        default:''
    },
    description:{
        type:String,
        default:''
    },
    h1:{
        type:String,
        default:''
    },
    descriptionH1:{
        type:String,
        default:''
    },
    metaSchema:{
      type:String,
      default:''
    },
    banner:{
        type:String,
        default:''
    },
    priceTable:{
        type:Boolean,
        default:false
    },
    relatedService:{
        type:Boolean,
        default: false
    },
    // faqs:[FaqSchema]
});



module.exports=mongoose.model('Page',PageSchema);
// module.exports=mongoose.model('Faq',FaqSchema);