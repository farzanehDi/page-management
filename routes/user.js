const express=require('express');
const router=express.Router();
const User=require('../models/user');
const bcrypt=require('bcryptjs');
const authenticate=require('../middleware/authenticate');
const multer=require('multer');
const {successFn}=require("../utils");

const storageProfile=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'../uploads/profilePicture')
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString().replace(/:/g, '-')+file.originalname)
    }
});
const uploadProfile=multer({storage:storageProfile});

//**save user**
router.post('/api/save_user',async (req,res)=>{

    const body=req.body;
    if(body.username==undefined||body.password==undefined){
        successFn(res,false,{message: 'پر کردن نام کاربری و پسورد الزامی است'});
    }
    try {
        let user=await User.findOne({username:req.body.username});
        if(user){
            successFn(res,false,{message: 'نام کاربری قبلا ثبت شده است'});
        }else {
            let newUser=await new User(body);
            await newUser.save();
            successFn(res,true,{message: 'کاربر مورد نظر با موفقیت ثبت شد'});
        }
    }catch (e) {
        successFn(res,false,{message: 'خطا در ایجاد کاربر'});
    }
});

//**login user**
router.post('/api/login',async (req,res)=>{

    const body=await req.body;
    if(!req.body.password || !req.body.username){
        successFn(res,false,{message:'پر کردن نام کاربری و پسورد الزامی است'});
    }
    try {
        let user=await User.findOne({username:body.username});
        if(!user){
            successFn(res,false,{message:'چنین کاربری وجود ندارد'});
        }
        let password=await bcrypt.compare(body.password,user.password);
        if (password){
            let token=await user.generateToken();
            successFn(res,true,{token,fullName: user.fullName,image: user.image,username:user.username});
        }else {
            successFn(res,false,{message:'پسورد وارد شده اشتباه می باشد'});
        }

    }catch (e) {
        successFn(res,false,{message: 'خطا'});
    }

});

//**update user**
router.post('/api/update_user',authenticate,uploadProfile.single('image'),async (req,res)=>{

    let image;
    if (!req.file) {
        image=req.user.image;
    }else {
        image=req.file.path;
    }

    const body=await req.body;
    let password=await body.password;

    try {
        if(!body.fullName || body.fullName.trim()==='' ){
            successFn(res,false,{message:'نام نمیتواند خالی باشد'});
        }else {
            if(password==null || password.trim()===''){
                password=req.user.password;
            }else {
                let salt=await bcrypt.genSalt(10);
                password=await bcrypt.hash(password,salt);
            }
            let user=await User.findByIdAndUpdate(req.user._id,{fullName:body.fullName,password,image:image});
            if(!user)
                successFn(res,false,{message:'کاربر مورد نظر یافت نشد'});

            successFn(res,true,{message:'اطلاعات کاربر با موفقیت به روز رسانی شد'})
        }
    }catch (e) {
        successFn(res,false,{message:'خطا در به روز رسانی اطلاعات کاربر'});
    }

});

//**logout user**
router.post('/api/logout',authenticate,async(req,res)=>{
    try {
        await req.user.deleteToken(req.token);
        successFn(res,true,{})
    }catch (e) {
        successFn(res,false,{message:e});
    }
});


module.exports=router;