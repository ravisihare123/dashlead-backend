var express = require('express');
var router = express.Router();
var pool = require('./knex');
// var LocalStorage = require('node-localstorage').LocalStorage;
// localStorage = new LocalStorage('./scratch')



router.post('/home',async function(req, res) {                          
    const result=  await pool('signup').select()
       if(result){
           console.log(req.body)
           res.status(200).json({result:true,data:result})
       } 
       else{
           res.status(500).json({result:false})
  
       }
      
   })





module.exports=router
