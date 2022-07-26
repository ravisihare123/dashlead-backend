const express = require("express");
//const moment = require("moment")
const router = express.Router();
var pool = require("./knex");
var auth = require("./jwtAuthentication");





router.post("/displaysalesitem", async function (req, res, next) {
  const result = await pool("salesitem")
  .join("sales","sales.salesid","=","salesitem.salesid")
    .where({"sales.salesid": req.body.salesid })
    .select("sales.*","salesitem.*");
  console.log(result)
  if (result) {
    console.log(result);
    res.status(200).json({ result: result });
  } else {
    console.log(error);
    res.status(500).json({ result: false });
  }
});






router.post("/insertsale", async function (req, res, next) {
  // console.log(".........Array Data.......",req.body[0].hsncode);
  // console.log(".........Json Data.......",req.body[1].billno);

  const result = await pool("sales").insert({
    billno: req.body[1].billno,
    date: req.body[1].date,
    customerid: req.body[1].customerid,
    totaligst: req.body[1].igst,
    totalsgst: req.body[1].sgst,
    totalcgst: req.body[1].cgst,
    subTotal: req.body[1].subTotal,
    grandtotal: req.body[1].grandtotal,
    inserttime: new Date(),
  });

  if (result) {
    const result = await pool("sales")
      .select("sales.salesid")
      .orderBy("salesid", "desc");
    //   console.log(result);
    var i = 0;
    for (i = 0; i < req.body[0].data.length; i++) {

      const result1 = await pool("salesitem").insert({
        salesid: result[0].salesid,
        // salesid:result[0]  it is used if another query not fire for require salesid
        productid: req.body[0].data[i].productid,
        productname: req.body[0].data[i].productname,
        hsncode: req.body[0].data[i].hsncode,
        price: req.body[0].data[i].price,
        qty: req.body[0].data[i].qty,
        igst: req.body[0].data[i].igst,
        sgst:req.body[0].data[i]. sgst,
        cgst: req.body[0].data[i].cgst,
        inserttime: new Date(),
      });
    }

    res.status(200).json({
      result: result,
    });
  } else {
    console.log(error);
    res.status(500).json({ result: false });
  }
});



router.post("/editsale", async function (req, res, next) {
  // console.log(".........Array Data.......",req.body[0].hsncode);
  // console.log(".........Json Data.......",req.body[1].billno);

  const result = await pool("sales").update({
   
    billno: req.body[1].billno,
    date: req.body[1].date,
    customerid: req.body[1].customerid,
    totaligst: req.body[1].igst,
    totalsgst: req.body[1].sgst,
    totalcgst: req.body[1].cgst,
    subTotal: req.body[1].subTotal,
    grandtotal: req.body[1].grandtotal,
    updatetime:new Date(),
  })
  .where({ salesid: req.body[1].salesid });

  if (result) {
 
    for (var i = 0; i < req.body[0].data.length; i++) {
      if(req.body[0].data[i].salesitemid){
      const result1 = await pool("salesitem").update({
        salesid: req.body[1].salesid,
        // salesid:result[0]  it is used if another query not fire for require salesid
        productid: req.body[0].data[i].productid,
        productname: req.body[0].data[i].productname,
        hsncode: req.body[0].data[i].hsncode,
        price: req.body[0].data[i].price,
        qty: req.body[0].data[i].qty,
        igst: req.body[0].data[i].igst,
        sgst:req.body[0].data[i]. sgst,
        cgst: req.body[0].data[i].cgst,
        updatetime:new Date(),
      })
      .where({ salesitemid: req.body[0].data[i].salesitemid });
    }
    else{
      const result1 = await pool("salesitem").insert({
        salesid: req.body[1].salesid,
        // salesid:result[0]  it is used if another query not fire for require salesid
        productid: req.body[0].data[i].productid,
        productname: req.body[0].data[i].productname,
        hsncode: req.body[0].data[i].hsncode,
        price: req.body[0].data[i].price,
        qty: req.body[0].data[i].qty,
        igst: req.body[0].data[i].igst,
        sgst:req.body[0].data[i]. sgst,
        cgst: req.body[0].data[i].cgst,
        inserttime:new Date(),
      })
      

    }

    }

    res.status(200).json({
      result: result,
    });
  } else {
    console.log(error);
    res.status(500).json({ result: false });
  }
});

router.get("/displaycustomer", auth, async function (req, res) {
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
    .join("states", "states.id", "=", "customer.state")
    .select("states.name as statename", "customer.*")
    .where({ isdelete: 0 });

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


router.get("/displayproduct", auth, async function (req, res) {
  const result = await pool("product")
    .join("hsn", "hsn.hsnid", "=", "product.hsnid")
    .select("hsn.*", "product.*")
    .where({});

  var arr = [];
  for (var x in result) {
    arr.push({
      value: result[x].productid,
      label: result[x].productname,
      hsnid: result[x].hsnid,
      hsncode: result[x].hsncode,
      price: result[x].price,
      igst: result[x].igst,
      sgst: result[x].sgst,
      cgst: result[x].cgst,
    });
  }
  if (arr) {
    console.log(result);
    res.status(200).json({
      result: arr,
    });
  } else {
    console.log(error);
    res.status(500).json({ result: false });
  }
});

router.get("/displayproductbyid", auth, async function (req, res) {
  const result = await pool("product")
    .join("hsn", "hsn.hsnid", "=", "product.hsnid")
    .select("hsn.*", "product.*");

  if (result) {
    //   console.log(result);
    res.status(200).json({
      result: result,
    });
  } else {
    console.log(error);
    res.status(500).json({ result: false });
  }
});


router.get("/displaybill",  async function (req, res) {
  var per_page = req.query.per_page;
  var page = req.query.page;
  console.log(per_page);
  console.log(page);
  const getCount = await pool("sales")
    .where({ isdelete: 0 })
    .count("salesid", { as: "total" })
    .first();
  var total = getCount.total;

  var offset = (page - 1) * [per_page];
  var total_page = total / per_page;

  const result = await pool("sales")
    .join("customer", "customer.customerid", "=", "sales.customerid")
    

    .select("customer.*", "sales.*")
    .where({"sales.isdelete": 0 }).limit(per_page).offset(offset);

  if (result) {
      // console.log(result);
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


router.get("/displaychart",  async function (req, res) {
  
  const result = await pool("sales")
  .select(pool.raw('month(date) as mon'))
  .sum('grandtotal as total')
  .groupBy('date')
    
    .where({"sales.isdelete": 0 })
    
    

  if (result) {
    var data = [["mon","total"]];
    for(var x in result){
      data.push([result[x].mon,result[x].total])
    }
      console.log("chart data............",data);
    res.status(200).json({
      result: data,
      
    });
  } else {
    console.log(error);
    res.status(500).json({ result: false });
  }
});




router.post("/deletesale", async function (req, res, next) {
  // console.log(req.body.salesid )
  const result = await pool("sales")
 
    .update({ isdelete: 1 })
    .where({ salesid:req.body.salesid });
  console.log(result);
  if (result) {

    const result1 = await pool("salesitem")
 
    .update({ isdelete: 1 })
    .where({ salesid: req.body.salesid });
 
    res.status(200).json({ result: result });
  } else {
    console.log(error);
    res.status(500).json({ result: false });
  }
});

module.exports = router;
