const express=require('express');
const router=express.Router();
const {successFn}=require("../utils");
const Page=require('../models/page');
const authenticate=require('../middleware/authenticate');

//**add page**
router.post('/api/add_page',authenticate,async(req,res)=>{

    const body=await req.body;
     try {
        const duplicatedPage=await Page.findOne({url:body.url});
        if (duplicatedPage){
            successFn(res,false,{message:'این آدرس قبلا ثبت شده است'});
        }else {
            let newPage=await new Page(body);
            await newPage.save();
            successFn(res,true,{message:'صفحه با موفقیت ایجاد شد'});
        }
    }catch (e) {
        successFn(res,false,{message:'خطا در ایجاد صفحه'});
    }

});

//**show pages**
router.get('/api/pages',authenticate,async (req,res)=>{
    let parameters=await req.query;

    if(!(parameters.length>0 && parameters.length<=20)){
        successFn(res,false,{message:'تعداد صفحات باید بین 1 و 20 باشد'});
    }

    try {
        let pages=await Page.find().skip(parseInt(parameters.offset)).limit(parseInt(parameters.length));
        let total=await Page.countDocuments();

        if(pages){
            successFn(res,true,{items:pages,total});
        }else {
            successFn(res,true,{items:[]});
        }

    }catch (e) {
        successFn(res,false,{message:'خطا در دریافت صفحات'})
    }

});

//**search page by url ans pass pageId**
router.get('/api/search_page',authenticate,async (req,res)=>{

    let search_phrase=await req.query.search_phrase.trim();

    try {

        let foundPages=await Page.find({url:{ "$regex":search_phrase, "$options": "i" }});
        // console.log('------------------------\n',foundPages);
        let passedData=foundPages.map(value=>{return {id:value._id,title:value.title}});
        successFn(res,true,{items:passedData})

    }catch (e) {
        successFn(res,false,{message:'خطا در جستجوی صفحات'});
    }

});

//**page details**
router.get("/api/page_details",authenticate,async (req,res)=>{

    const PageId=await req.query.id;
    try {
        const searchedPage=await Page.findById(PageId);
        if (searchedPage){
            successFn(res,true,{page_details:{
                    title:searchedPage.title,
                    description:searchedPage.description,
                    h1:searchedPage.h1,
                    descriptionH1:searchedPage.descriptionH1,
                    schema:searchedPage.metaSchema,
                    banner:searchedPage.banner,
                    priceTable:searchedPage.priceTable,
                    relatedService:searchedPage.relatedService,
                }});

        } else {
            successFn(res,false,{message:"صفحه مورد نظر یافت نشد"});
        }

    }catch (e) {
        successFn(res,false,{message:"صفحه مورد نظر یافت نشد"});
    }

});

module.exports=router;