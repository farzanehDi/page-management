const successFn=(res,result,data)=>{
    res.status(200).json({result,...data})
};



module.exports={
  successFn
};