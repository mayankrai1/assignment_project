const express = require('express');
var mongodb = require("mongodb");
const router = express.Router();
const User = require('../models/user.model');
const Prospect = require('../models/prospects.model')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isEmpty = require('../utils/is-empty');
const userCtrl = require('../controllers/user.controller');
const mongoose = require('mongoose');



router.get("/all_user", (req, res) => {
  console.log(req.user.type);
  if(req.user.type == 1){
    User.find({type: 2}).then(user => {
      res.json({ status: 200, errors: false, data: user.reverse(), message: "User find Successfull.!" })
    }).catch(err => {
      res.json({ status: 500, errors: true, data: null, message: err })
    })
  }else res.send(" NOT FOUND");
 
});
router.get("/all_product", (req, res) => {
  if(req.user.type == 1){
    Prospect.find({}).populate('user_id').then(user => {
      res.json({ status: 200, errors: false, data: user.reverse(), message: "User find Successfull.!" })
    }).catch(err => {
      res.json({ status: 500, errors: true, data: null, message: err })
    })
  }else res.send(" NOT FOUND");
});

router.get("/block_product/:id", (req, res) => {
  console.log(req.params)
  if(req.user.type == 1){
    Prospect.findByIdAndUpdate({_id:mongoose.Types.ObjectId(req.params.id)}, { $set: {isBlock:true} }, { new: true },(err, doc) =>{
      if (!doc)
        return res.status(404).send("data is not found");
      else {
        return res.json({ errors: false, data: doc, status: 200 })
      }
    })
  }else res.send(" NOT FOUND");
});

router.get("/unblock_product/:id", (req, res) => {
  console.log(req.params)
  if(req.user.type == 1){
    Prospect.findByIdAndUpdate({_id:mongoose.Types.ObjectId(req.params.id)}, { $set: {isBlock:false} }, { new: true },(err, doc) =>{
      if (!doc)
        return res.status(404).send("data is not found");
      else {
        return res.json({ errors: false, data: doc, status: 200 })
      }
    })
  }else res.send(" NOT FOUND");
});




module.exports = router;
