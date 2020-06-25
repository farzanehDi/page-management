const express=require('express');
const router=express.Router();
const authenticate=require('../middleware/authenticate');
const multer=require('multer');
const Page=require('../models/page');
const RelatedServices=require('../models/relatedServices');
const {successFn}=require("../utils");
const fs=require('fs');

const storageRelatedServices=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads/relatedServices')
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString().replace(/:/g, '-')+file.originalname)
    }
});
const uploadRelatedServices=multer({storage:storageRelatedServices});

//**add related service**
router.post('/api/add_related_services',authenticate,uploadRelatedServices.single('image'),async (req,res)=>{

    const body=await req.body;
    const file=await req.file;
    try {
        await Page.findById(body.pageId); //check page exit

        //check relatedServices already create or not
        let relatedServices=await RelatedServices.findOne({pageId: body.pageId});

        if(relatedServices){ //if relatedServices created
            if(body.relatedServicesId && body.relatedServicesId.trim()!="" ){ //if this related services already exist=>update this

               //remove previous image
               let existService=await (relatedServices.relatedServices).find(item=>item._id==body.relatedServicesId);
               await fs.unlinkSync(existService.image);
               //update record
               await RelatedServices.updateOne(
                    { _id:relatedServices._id, "relatedServices._id":body.relatedServicesId},
                    { $set: {   "relatedServices.$.title" : body.title,
                                "relatedServices.$.link" : body.link,
                                "relatedServices.$.image" : file.path,
                            }
                    }
                );
                successFn(res,true,{message:'سرویس مرتبط با موفقیت به روز شد'});

            }else { //this related services add to array
                RelatedServices.findByIdAndUpdate(relatedServices._id,
                    {
                        $push:{
                            relatedServices:{
                                title:body.title,
                                link:body.link,
                                image:file.path
                            }
                        }
                    }).then(result=>{
                    successFn(res,true,{message:'سرویس  مرتبط با موفقیت ذخیره شد'});
                }).catch(err=>{
                    successFn(res,false,{message:'خطا در ذخیره سرویس های مرتبط'});
                })
            }
        }else {  //if related services not exit => create new record
            let newRelatedServices=new RelatedServices({
                    pageId:body.pageId,
                    relatedServices:{
                        title:body.title,
                        link:body.link,
                        image: file.path
                    }
                });
            newRelatedServices.save( (error,result)=>{
                if(error){
                    successFn(res,false,{message:'خطا در ذخیره سرویس های مرتبط'});
                }else
                    successFn(res,true,{message:'سرویس مرتبط با موفقیت ذخیره شد'});
            });
        }

    }catch (e) {
        console.log(e);
        successFn(res,false,{message:'صفحه مورد نظر یافت نشد'});
    }
});

module.exports=router;