var express = require("express");
var router = express.Router();
var pool = require("../routes/knex");


  async function insertcategory(req, res, next) {
    console.log(req.body);
    console.log(req.myfilename);
    const result = await pool("category").insert({
      categoryname: req.body.categoryname,
      description: req.body.description,
      image: req.myfilename,
      inserttime:moment().format("YYYY-MM-DD hh:mm:ss"),
      
    });

    if (result) {
      console.log(result);
      res.status(200).json({ result: result });
    } else {
      console.log(error);
      res.status(500).json({ result: false });
    }
  }


const categoryconstroller={insertcategory,
   }
  module.exports = categoryconstroller;