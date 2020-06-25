const express=require('express');
const app=express();
const mongoose = require('mongoose');
const config=require("./utils/config");
const userRoutes=require('./routes/user');
const pageRoutes=require('./routes/page');
const faqRoutes=require('./routes/faq');
const relatedServiceRoutes=require('./routes/relatedService');

app.use(express.json());
//*******routes section********
app.use(userRoutes);
app.use(pageRoutes);
app.use(faqRoutes);
app.use(relatedServiceRoutes);
//*****************************
mongoose.connect(config.MONGOURI, {useNewUrlParser: true,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify: false })
    .then(()=>{

        app.listen(config.PORT,()=>{
            console.log('server is running on port 3000');
        });
    })
    .catch(err=>{
        console.log(err);

    });