const express=require('express');
const router=express.Router();
const authenticate=require('../middleware/authenticate');
const multer=require('multer');
const RelatedServices=require('../models/relatedServices');
const {successFn}=require("../utils");

const storageRelatedServices=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'../uploads/relatedServices')
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString().replace(/:/g, '-')+file.originalname)
    }
});
const uploadRelatedServices=multer({storage:storageRelatedServices});

//**add related service**
router.post('/api/add_related_services',authenticate,uploadRelatedServices.single('image'),async (req,res)=>{

    // const body=req.body;
    console.log('yuy',req.body);

    // try {
    //     let page=await Page.findById(body.pageId); //check page exit
    //
    //     //check related services already create or not
    //     RelatedServices.findOne({pageId: body.pageId},(err,relatedServices)=>{
    //
    //         if(relatedServices){
    //             //if related services created => update record
    //             RelatedServices.findByIdAndUpdate(relatedServices._id,{faqs:body.items}).then(result=>{
    //
    //                 successFn(res,true,{message:'سرویس های مرتبط با موفقیت ذخیره شدند'});
    //
    //             }).catch(err=>{
    //
    //                 successFn(res,false,{message:'خطا در ذخیره سرویس های مرتبط'});
    //             })
    //
    //
    //         }else {
    //
    //             //if this faq not exit => create new record
    //             let newRelatedServices=new RelatedServices({pageId:body.pageId,relatedServices:body.items});
    //             newRelatedServices.save( (error,result)=>{
    //                 if(error){
    //
    //                     successFn(res,false,{message:'خطا در ذخیره سرویس های مرتبط'});
    //                 }
    //                 else
    //                     successFn(res,true,{message:'سرویس های مرتبط با موفقیت ذخیره شدند'});
    //             });
    //
    //         }
    //
    //     });
    //
    // }catch (e) {
    //     console.log(e);
    //     successFn(res,false,{message:'صفحه مورد نظر یافت نشد'});
    // }

});

module.exports=router;