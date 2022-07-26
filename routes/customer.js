const express = require("express");
//const moment = require("moment")
const router = express.Router();
var pool = require("./knex");
var auth=require('./jwtAuthentication')



router.post(
    "/insertcustomer",
  
    async function (req, res, next) {
      console.log(req.body);
      
      const result = await pool("customer").insert({
        name:req.body.name,
        mobile:req.body.mobile,
        whatsapp:req.body.whatsapp
        ,address:req.body.address
        ,state:req.body.state,
        city:req.body.city,
        gstno:req.body.gstno,
      
        inserttime:new Date(),
        
      });
  
      if (result) {
        console.log(result);
        res.status(200).json({ result: result });
      } else {
        console.log(error);
        res.status(500).json({ result: false });
      }
    }
  );

  router.get("/displaycustomer", auth, async function (req, res ) {
    var per_page = req.query.per_page;
    var page = req.query.page;
    console.log(per_page);
    console.log(page);
    const getCount = await pool("customer")
      .where({ isdelete: 0 })
      .count("customerid", { as: "total" })
      .first();
    var total = getCount.total;
  
    var offset = (page - 1) * [per_page];
    var total_page = total / per_page;
  
    const result = await pool("customer")
    .join('states', 'states.id', '=', 'customer.state')
    .join('cities','cities.id','=','customer.city')
    .select("states.name as statename","customer.*",'cities.city as cityname')
      .where({"customer.isdelete": 0 })
      .limit(per_page)
      .offset(offset);
  
   
    if (result) {
      //   console.log(result);
      res.status(200).json({
        result: result,
        total_page: Math.ceil(total_page),
        total: total,
      });
    } else {
      console.log(error);
      res.status(500).json({ result: false });
    }
    
  });

  router.post(
    "/editcustomerdata",
    async function (req, res, next) {
      console.log(req.body);
  
      const result = await pool("customer")
        .update({
            name:req.body.name,
            mobile:req.body.mobile,
            whatsapp:req.body.whatsapp
            ,address:req.body.address
            ,state:req.body.state,
            city:req.body.city,
            gstno:req.body.gstno,
          updatetime:new Date(),
        })
        .where({ customerid: req.body.customerid });
  
      if (result) {
        console.log(result);
        res.status(200).json({ result: result });
      } else {
        console.log(error);
        res.status(500).json({ result: false });
      }
    }
  );


  router.post("/deletecustomer", async function (req, res, next) {
    const result = await pool("customer")
      .update({ isdelete: 1 })
      .where({ customerid: req.body.customerid });
    console.log(result);
    if (result) {
      console.log(result);
      res.status(200).json({ result: result });
    } else {
      console.log(error);
      res.status(500).json({ result: false });
    }
  });

  router.get("/states", async function (req, res) {
    
    const result = await pool("states").select()
   if (result) {
     
      res.status(200).json({
        result: result
       });
    } else {
      console.log(error);
      res.status(500).json({ result: false });
    }
    
  });


  router.post("/city", async function (req, res) {
    
    const result = await pool("cities").where({state_id:req.body.stateid}).select()
    
    if (result) {
      
      res.status(200).json({
        result: result,
      });
    } else {
      console.log(error);
      res.status(500).json({ result: false });
    }
  });



  




















module.exports = router;