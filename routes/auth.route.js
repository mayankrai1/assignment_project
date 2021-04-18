const express = require('express');
const router = express.Router();
const UserController = require("../controllers/user.controller");
const User = require('../models/user.model');
const isEmpty = require('../utils/is-empty');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const userCtrl = require('../controllers/user.controller');

router.post('/register', async (req, res) => {
  if (req.headers.token) {
    if (typeof req.headers.token == "string" && req.headers.token.trim() !== "") {
      try {
        let payload = jwt.verify(req.headers.token, process.env.JWT_SECRET)
        User.findById(payload._id, "-password").populate("position").exec().then(doc => {
          if (doc) {
            let u = doc.toObject();
            // delete u.hashedPassword;
            req.user = u;
            res.json({ status: 200, data: u, errors: false, message: "You are already logged in!" });
          } else {
            res.status(403).json({ status: 403, data: null, errors: true, message: "Forbidden" });
          }
        })
      } catch (err) {
        if (err) {
          res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid token" });
        }
      }
    } else {
      res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid token" })
    }
  } else {
    result = await UserController.verifyCreate(req.body);
    if (!isEmpty(result.errors)) {
      console.log(result.errors);
      return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields required" });
    }
    User.findOne({ email: result.data.email }, (e, d) => {
      if (e) {
        return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while verifying user details" })
      }
      if (d) {
        return res.json({ status: 200, errors: true, data: null, message: "Email already exists" })
      } else {
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(result.data.password, salt, function (err, hash) {
            if (err)
              // console.log(err)
           return res.status(500).json({ status: 500, data: null, errors: true, message: "Something went wrong with your password" });
            result.data.password = hash;
             const newUser = new User(result.data);
            newUser.save().then(doc => {
              doc.populate("role", (e, d) => {
                jwt.sign({ _id: d._id }, process.env.JWT_SECRET, function (err, token) {
                  if (err) {
                    console.log(err);
                    res.status(500).json({ message: "Error while generating token", status: 500, errors: true, data: null });
                  }
                  else {
                    let u = d.toObject();
                    delete u.password;
                    req.user = u;
                    res.json({ message: "User registered successfully", status: 200, errors: false, data: { token, user: u } });
                  }
                });
              })
            }).catch(e => {
              console.log(e);
              res.status(500).json({ message: "Error while registering user", status: 500, errors: true, data: null });
            })
          });
        });
      }
    })
  }
});
router.post('/login', async (req, res) => {
  // console.log("LOGIN ROUTE")
  console.log(req.body)
  if (req.headers.token != undefined) {
    if (typeof req.headers.token == "string" && req.headers.token.trim() !== "") {
      // console.log("HAS TOKEN");
      jwt.verify(req.headers.token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
          console.log(err);
          return res.json({ status: 400, errors: true, data: null, message: "Invalid token" })
        } else {
          User.findById(payload._id, (err, doc) => {
            if (err) {
              console.log(err);
              return res.json({ status: 500, errors: true, data: null, message: "Error while validating your token details" })
            }
            if (doc) {
              let u = doc.toObject();
              delete u.password;
              req.user = u;
              res.json({ status: 200, data: u, errors: false, message: "You are already logged in!" });
            } else {
              return res.json({ status: 500, data: null, errors: true, message: "Error while validating your token details" })
            }
          })
          // next();
        }
      })
    } else {
      return res.json({ status: 400, data: null, errors: true, message: "Invalid token" });
    }
  } else {
    let result = UserController.verifyLogin(req.body);
    if (!isEmpty(result.errors)) {
      return res.json({ status: 400, data: null, errors: result.errors, message: "Fields required" });
    }
    if (req.body.username && req.body.password) {
      let username = req.body.username.trim();
      User.findOne({$and:[{ username: username},{type:2}]}, (err, user) => {
        // console.log(user)
        if (err) {
          console.log(err);
          return res.json({ status: 500, data: null, errors: true, message: "Error while finding the user" });
        }
        if (user) {
          bcrypt.compare(req.body.password, user.password, function (er, isMatched) {
            if (er) {
              console.log(er);
              return res.json({ status: 401, data: null, errors: true, message: "Error in validating Credentials" });
            }
            if (isMatched) {
              const u = user.toObject();
              delete u.password;
              req.user = u;
              jwt.sign({ _id: u._id }, process.env.JWT_SECRET, function (err, token) {
                if (err) {
                  console.log(err);
                  return res.json({ status: 500, errors: true, data: null, message: "Error while generating token" })
                }
                else {
                  user = user.toObject();
                  delete user.password;
                  req.user = user;
                  return res.json({ status: 200, data: { token, user }, errors: false, message: "Login successfull" })
                }
              })
            } else {
              return res.json({ status: 401, data: null, errors: true, notmessage: "Invalid Credentials" });
            }
          });
        } else {
          return res.json({ status: 404, data: null, errors: true, message: "User not exist" });
        }
      }).populate('position').exec()
      // }).populate("position")
    }
  }
});
router.post('/admin/login', async (req, res) => {
  // console.log("LOGIN ROUTE")
  console.log(req.body)
  if (req.headers.token != undefined) {
    if (typeof req.headers.token == "string" && req.headers.token.trim() !== "") {
      // console.log("HAS TOKEN");
      jwt.verify(req.headers.token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
          console.log(err);
          return res.json({ status: 400, errors: true, data: null, message: "Invalid token" })
        } else {
          User.findById(payload._id, (err, doc) => {
            if (err) {
              console.log(err);
              return res.json({ status: 500, errors: true, data: null, message: "Error while validating your token details" })
            }
            if (doc) {
              let u = doc.toObject();
              delete u.password;
              req.user = u;
              res.json({ status: 200, data: u, errors: false, message: "You are already logged in!" });
            } else {
              return res.json({ status: 500, data: null, errors: true, message: "Error while validating your token details" })
            }
          })
          // next();
        }
      })
    } else {
      return res.json({ status: 400, data: null, errors: true, message: "Invalid token" });
    }
  } else {
    let result = UserController.verifyLogin(req.body);
    if (!isEmpty(result.errors)) {
      return res.json({ status: 400, data: null, errors: result.errors, message: "Fields required" });
    }
    if (req.body.username && req.body.password) {
      let username = req.body.username.trim();
      User.findOne({$and:[{ username: username},{type:1}]}, (err, user) => {
        // console.log(user)
        if (err) {
          console.log(err);
          return res.json({ status: 500, data: null, errors: true, message: "Error while finding the user" });
        }
        if (user) {
          bcrypt.compare(req.body.password, user.password, function (er, isMatched) {
            if (er) {
              console.log(er);
              return res.json({ status: 401, data: null, errors: true, message: "Error in validating Credentials" });
            }
            if (isMatched) {
              const u = user.toObject();
              delete u.password;
              req.user = u;
              jwt.sign({ _id: u._id }, process.env.JWT_SECRET, function (err, token) {
                if (err) {
                  console.log(err);
                  return res.json({ status: 500, errors: true, data: null, message: "Error while generating token" })
                }
                else {
                  user = user.toObject();
                  delete user.password;
                  req.user = user;
                  return res.json({ status: 200, data: { token, user }, errors: false, message: "Login successfull" })
                }
              })
            } else {
              return res.json({ status: 401, data: null, errors: true, notmessage: "Invalid Credentials" });
            }
          });
        } else {
          return res.json({ status: 404, data: null, errors: true, message: "User not exist" });
        }
      }).populate('position').exec()
      // }).populate("position")
    }
  }
});
router.post('/admin/register', async (req, res) => {
  req.body.type=1;
let result = userCtrl.verifyCreate(req.body)
if (isEmpty(result.errors)) {
  User.findOne({ type:1 }, async (err, doc) => {
    if (err)
      return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while verifying the Admin" });
    if (doc)
      return res.status(400).json({ status: 400, errors: true, data: null, message: "Admin already exit" });
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

module.exports = router;
