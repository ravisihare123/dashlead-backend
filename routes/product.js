const express = require("express");
const moment = require("moment")
const router = express.Router();
var pool = require("./knex");
var upload = require("./multer");
var auth=require('./jwtAuthentication')

router.post(
  "/insertproduct",
  upload.single("image"),
  async function (req, res, next) {
    console.log(req.body);
    console.log(req.myfilename);
    const result = await pool("product").insert({
      categoryid: req.body.categoryid,
      hsnid:req.body.hsnid,
      productname: req.body.productname,
      description: req.body.description,
      price: req.body.price,
      image: req.myfilename,
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

router.get("/displayproduct",auth, async function (req, res) {
  // console.log(req.query);
  // console.log(req.file);
  var per_page = req.query.per_page;
  var page = req.query.page;
  console.log(per_page);
  console.log(page);
  const getCount = await pool("product")
    .where({ isdelete: 0 })
    .count("productid", { as: "total" })
    .first();
  var total = getCount.total;

  var offset = (page - 1) * [per_page];
  var total_page = total / per_page;

  const result = await pool("product")
  .join('category', 'product.categoryid', '=', 'category.categoryid')
  .join('hsn', 'product.hsnid', '=', 'hsn.hsnid')
  .select('category.categoryname','product.*','hsn.hsncode')
    .where({"product.isdelete": 0 })
    .limit(per_page)
    .offset(offset);

  //   knex('users')
  // .join('contacts', 'users.id', '=', 'contacts.user_id')
  // .select('users.id', 'contacts.phone')
  //pool.select("*").from('category').limit(3)
  // pool.select('*').from('category').limit(3).offset(1)
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
    "/editproductdata",
    upload.single("image"),
    async function (req, res, next) {
      console.log(req.body);
  
      const result = await pool("product")
        .update({
          categoryid: req.body.categoryid,
          hsnid:req.body.hsnid,
          productname:req.body.productname,
          description: req.body.description,
          price:req.body.price,
          image: req.myfilename,
          updatetime:new Date(),
        })
        .where({ productid: req.body.productid });
  
      if (result) {
        console.log(result);
        res.status(200).json({ result: result });
      } else {
        console.log(error);
        res.status(500).json({ result: false });
      }
    }
  );


  router.post("/deleteproduct", async function (req, res, next) {
    const result = await pool("product")
      .update({ isdelete: 1 })
      .where({ productid: req.body.productid });
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
