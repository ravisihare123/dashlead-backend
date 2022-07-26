const express = require("express");
//const moment = require("moment")
const router = express.Router();
var pool = require("./knex");
var auth=require('./jwtAuthentication')


router.post("/inserthsn",async function (req, res, next) {
    console.log(req.body);
    
    const result = await pool("hsn").insert({
        hsncode:req.body.hsncode,
        igst:req.body.igst,
        sgst:req.body.sgst,
        cgst:req.body.cgst,
      description: req.body.description,
    
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




router.get("/displayhsn",auth, async function (req, res ) {
    var per_page = req.query.per_page;
    var page = req.query.page;
    console.log(per_page);
    console.log(page);
    const getCount = await pool("hsn")
      .where({ isdelete: 0 })
      .count("hsnid", { as: "total" })
      .first();
    var total = getCount.total;
  
    var offset = (page - 1) * [per_page];
    var total_page = total / per_page;
  
    const result = await pool("hsn")
    //.join('category', 'product.categoryid', '=', 'category.categoryid')
    .select()
      .where({"hsn.isdelete": 0 })
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
    "/edithsndata",
    async function (req, res, next) {
      console.log(req.body);
  
      const result = await pool("hsn")
        .update({
            hsncode:req.body.hsncode,
            igst:req.body.igst,
            sgst:req.body.sgst,
            cgst:req.body.cgst,
          description: req.body.description,
          updatetime:new Date(),
        })
        .where({ hsnid: req.body.hsnid });
  
      if (result) {
        console.log(result);
        res.status(200).json({ result: result });
      } else {
        console.log(error);
        res.status(500).json({ result: false });
      }
    }
  );


  router.post("/deletehsn", async function (req, res, next) {
    const result = await pool("hsn")
      .update({ isdelete: 1 })
      .where({ hsnid: req.body.hsnid });
    console.log(result);
    if (result) {
      console.log(result);
      res.status(200).json({ result: result });
    } else {
      console.log(error);
      res.status(500).json({ result: false });
    }
  });

module.exports = router;