const mongoos=require('mongoose');
const Schema=mongoos.Schema;
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const config=require("../utils/config");

const options={
    type:String,
    required:true
};

const UserSchema=new Schema({

    fullName:{
        type:String,
        minLength:3,
        trim:true,
        default: ''
    },
    username:{
      type:String,
      required:true,
      minLength:5
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    image:{
      type:String,
      required:false,
      default:''
    },
    tokens:[{
        _id:false,
        token:options,
    }]

});



UserSchema.methods.generateToken=function (){
    const user=this;

    let token=jwt.sign({_id:user._id.toHexString()},config.SECRET_KEY).toString();

    user.tokens.push({token});

    return user.save().then(()=>{
        return token
    })
};


UserSchema.statics.findByToken=function(token){
    const User=this;
    let decoded;
    try {
        decoded=jwt.verify(token,config.SECRET_KEY);

    }catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        _id:decoded._id,
        'tokens.token':token,
    })

};

UserSchema.methods.deleteToken=function(token){

    let user=this;
    return user.update({
        $pull:{
            tokens:{token}
        }
    })
};


UserSchema.pre('save',function(next){
    const user=this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            if (err){ return next(err) }
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password=hash;
                next();
            });
        })
    }else {
        next();
    }
});


module.exports=mongoos.model('User',UserSchema);