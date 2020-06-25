const express=require('express');
const router=express.Router();
const Faq=require('../models/faq');
const {successFn}=require("../utils");
const Page=require('../models/page');
const authenticate=require('../middleware/authenticate');

//**add faq**
router.post('/api/add_faq',authenticate,async(req,res)=>{

    const body=await req.body;
    try {
         await Page.findById(body.pageId); //check page exit

         //check faq already create or not
         let faq=await Faq.findOne({pageId: body.pageId});

         if(faq){ //if faq created => update record
            Faq.findByIdAndUpdate(faq._id,{faqs:body.items}).then(result=>{
                successFn(res,true,{message:'پرسش ها با موفقیت ذخیره شدند'});
            }).catch(err=>{
                successFn(res,false,{message:'خطا در ذخیره پرسش های متداول'});
            })

         }else {  //if this faq not exit => create new record
            let newFaq=new Faq({pageId:body.pageId,faqs:body.items});
            newFaq.save( (error,result)=>{
                if(error){
                    successFn(res,false,{message:'خطا در ذخیره پرسش های متداول'});
                }else
                    successFn(res,true,{message:'پرسش ها با موفقیت ذخیره شدند'});
            });
         }

    }catch (e) {
        console.log(e);
        successFn(res,false,{message:'صفحه مورد نظر یافت نشد'});
    }

});

//**delete faq**
router.delete('/api/delete_faq',authenticate,async (req,res)=>{

    const body=await req.body;

    try {
        await Faq.findOneAndUpdate({pageId:body.pageId},{
            $pull:{
                faqs:{_id:body.faqId}
            }
        });
        successFn(res,true,{message:"مورد با موفقیت حذف شد"});

    }catch (e) {
        successFn(res,false,{message:"خطا در حذف پرسش و پاسخ"});
    }
});

//**get faqs**
router.get('/api/faqs/:id',authenticate,async (req,res)=>{

    const id=await req.params.id;
    try {
        let data=await Faq.findOne({pageId:id});
        if(data){
            let faqsList=data.faqs.map(item=>{return{id:item._id,answer:item.answer,question:item.question}});
            successFn(res,true,{items:faqsList});
        }else {
            successFn(res,false,{message:'صفحه مورد نظر یافت نشد'});
        }

    }catch (e) {
        successFn(res,false,{message:'خطا در دریافت اطلاعات'})
    }
});

module.exports=router;