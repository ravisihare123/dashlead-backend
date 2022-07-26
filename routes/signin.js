var express = require('express');
var router = express.Router();
var knex = require('./knex');
const jwt = require('jsonwebtoken')
const config = require("../secret.json")
// var LocalStorage = require('node-localstorage').LocalStorage;
// localStorage = new LocalStorage('./scratch')



router.post('/fillsignin',async function(req, res) {  
    
    const email = req.body.email;
    const password = req.body.password;
    if(email == "" &&  password == "") {
        //    console.log(req.body)
        console.log("email and password not filled");
        res.status(200).json({result:false ,data:"email and password not filled"})
           
       } 


       else {
           const result=  await knex('signup').where({email:email,password:password}).select();
           // console.log(result[0].email);
           if(result.length==0 ){
       // console.log(result[0].email);
      
       res.status(500).json({result:false,data:false})
       console.log("error");

          
           }
           else{
               const userData = knex('signup').where({email:email}).select();
               const token = jwt.sign({sub: userData.email}, config.secret,{ expiresIn: "1h", });


            res.status(200).json({result:true ,token:token,data:result})
            // localStorage.setItem('UserLogData',token)
           
        console.log(result,token);

           }
  
       }
      
      
   })




   module.exports=router
