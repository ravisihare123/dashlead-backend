var express = require('express');
var router = express.Router();
var pool = require('./knex')
var pool1=require("./pool")


// knex('user').insert({email: req.body.email})
//       .then( function (result) {
//           res.json({ success: true, message: 'ok' });     // respond back to request
//        })

// router.route('/user').post(function(req, res) {                          
//     knex('user').insert({email: req.body.email}).then(function(ret){
//       res.json({ success: true, message: 'ok'/*,ret:ret*/});  
//     });   
//   });


router.post('/fillsignup',async function(req, res) {                          
  const result=  await pool('signup').select()
     if(result){
         console.log(req.body)
         res.status(200).json({result:true,data:result})
     } 
     else{
         res.status(500).json({result:false})

     }
    
 })
  









router.post('/register', async function(req, res,next) { 
    console.log(req.body)                         
     const result= await pool('signup').insert({name: req.body.name,email: req.body.email,password: req.body.password})
        if(result){
            
            res.status(200).json({result:true,result:result, USER :{name: result}})
        } 
        else{
            res.status(500).json({result:false})

        }
       
    })
    






    // router.post('/signup', function(req, res, next) {

    //     console.log(req.body)
    //       pool('signup').insert({name:req.body.name,email:req.body.email ,password:req.body.password})
    //       .then( function (result) {
      
    //          if(result) {
    //           res.json({ success: true, message: 'ok',result:result });     // respond back to request
    //           console.log(JSON.stringify(result));
    //       }
    //        })
    //   });







//  ///////////runinng//////////////////

// router.get('/signup', function(req, res, next) {
    //     pool('signup').insert({email:req.body.email ,password:req.body.password})
    //     .then( function (result) {
        //         res.json({ success: true, message: 'ok',data:result });     // respond back to request
        //         console.log(res.json(result));
        //      })
        // });




// router.post('/insertsignup',function(req, res, next) {
//     console.log(req.body)
//     pool1.query("insert into signup(name,email,password) values(?,?,?)",[req.body.name,req.body.email,req.body.password],function(error,result){
//         if(error){
//             console.log(error)
//             res.status(500).json({result:false})
//         }
//         else{
            
//             res.status(200).json({result:true,data:result})
            
//         }
//     })
    
// })

module.exports=router