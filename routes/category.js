const express = require("express");
const moment = require("moment")
const router = express.Router();
var pool = require("./knex");
var upload = require("./multer");
var categoryconstroller = require("../controller/category")

var auth=require('./jwtAuthentication')



router.post("/insertcategory",upload.single("image"),categoryconstroller.insertcategory);

router.get("/displaycategory", auth ,async function (req, res, next) {
  console.log(req.query);
  console.log(req.file);
  var per_page = req.query.per_page;
  var page = req.query.page;

  const getCount = await pool("category")
    .where({ isdelete: 0 })
    .count("categoryid", { as: "total" })
    .first();
  var total = getCount.total;

  var offset = (page - 1) * [per_page];
  var total_page = total / per_page;

  const result = await pool("category")
    .where({ isdelete: 0 })
    .select()
    .limit(per_page)
    .offset(offset);
  //pool.select("*").from('category').limit(3)
  // pool.select('*').from('category').limit(3).offset(1)
  if (result) {
    console.log(result);
    res.status(200).json({st:true,
      result: result,
      total_page: Math.ceil(total_page),
      total: total,
    });
  } else {
    console.log(error);
    res.status(500).json({ st: false });
  }
});

router.post(
  "/editcategorydata",
  upload.single("image"),
  async function (req, res, next) {
    console.log(req.body);

    const result = await pool("category")
      .update({
        categoryname: req.body.categoryname,
        description: req.body.description,
        image: req.myfilename,
        updatetime:moment().format("YYYY-MM-DD hh:mm:ss")
      })
      .where({ categoryid: req.body.categoryid });

    if (result) {
      console.log(result);
      res.status(200).json({ result: result });
    } else {
      console.log(error);
      res.status(500).json({ result: false });
    }
  }
);

// router.post('/deletecategory', async function(req, res, next) {

//     const result=await
//     pool('category').delete().where({categoryid:req.body.categoryid})
//     console.log(result)
//         if(result){
//             console.log(result)
//             res.status(200).json({result:result})
//         }
//         else{
//             console.log(error)
//             res.status(500).json({result:false})
//         }

// });

router.post("/deletecategory", async function (req, res, next) {
  const result = await pool("category")
    .update({ isdelete: 1 })
    .where({ categoryid: req.body.categoryid });
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
