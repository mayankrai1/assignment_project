const express = require('express');
var mongodb = require("mongodb");
const router = express.Router();
const User = require('../models/user.model')
// const User_role = require('../models/userRole.model')
// const authorizePrivilege = require('../middleware/authorizationMiddleware');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isEmpty = require('../utils/is-empty');
const userCtrl = require('../controllers/user.controller');
const mongoose = require('mongoose');

router.get('/me/', (req, res) => {
  User.findById({ _id: req.user._id }, { password: 0 }, (err, doc) => {
    if (err)
      res.json({ errors: true, status: 400, data: null })
    else
      res.json({ errors: false, status: 200, data: doc })
  }).populate("position company")
})

router.get("/all_user", (req, res) => {
  User.find({}).then(user => {
    res.json({ status: 200, errors: false, data: user.reverse(), message: "User find Successfull.!" })
  }).catch(err => {
    res.json({ status: 500, errors: true, data: null, message: err })
  })
})

router.post('/crete_user', async (req, res) => {
  let result = userCtrl.verifyCreate(req.body)
  if (isEmpty(result.errors)) {
    User.findOne({ email: result.data.email }, async (err, doc) => {
      if (err)
        return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while verifying the email" });
      if (doc)
        return res.status(400).json({ status: 400, errors: true, data: null, message: "Email already registered" });
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(result.data.password, salt, function (err, hash) {
          result.data.password = hash;
          const newuser = new User(result.data);
          newuser.save().then(data => {
            data = data.toObject();
            delete data.password;
            res.status(200).json({ status: 200, errors: false, data, message: "User Added successfully" });
          }).catch(err => {
            res.status(500).json({ status: 500, errors: true, data: null, message: err });
          })
        });
      });
    });
  } else {
    return res.status(400).json({ status: 500, errors: true, data: null, message: "Internal Server Error" });
  }
});
router.put('/upadte_user/:id', async (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, doc) {
    if (!doc)
      return res.status(404).send("data is not found");
    else {
      return res.json({ errors: false, data: doc, status: 200 })
    }
  })
});
router.delete('/delete/:_id', async (req, res) => {
  if (mongodb.ObjectID.isValid(req.params._id)) {
      User.findByIdAndDelete(req.params._id).then((response) => {
          return res.json({ errors: false, message: 'User Deleted', status: 200, data: null });
      }).catch(err =>{throw err})
  }
});


module.exports = router;
