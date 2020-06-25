const User=require("../models/user");
const {successFn}=require("../utils");

let authenticate=(req,res,next)=>{

    let token=req.header('token');
    User.findByToken(token).then(user=>{

        req.user=user;
        req.token=token;
        next();

    }).catch(err=>{
        successFn(res,false,{message:'توکن یافت نشد',server_error:true})
    })
};

module.exports=authenticate;