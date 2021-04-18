const express = require('express');
var mongodb = require("mongodb");
const router = express.Router();
const Prospect = require('../models/prospects.model')
const isEmpty = require('../utils/is-empty');
const prospectCtrl = require('../controllers/prospects.controller');
const mongoose = require('mongoose');

router.post('/create_product', (req, res) => {
    req.body.user_id = String(req.user._id)
    req.body.product_id = "PR# " + Math.floor(Math.random() * 10000)
    let result = prospectCtrl.insert(req.body);
    if (!isEmpty(result.errors)) {
        res.status(400).json(result.errors);
    }
    let newClient = new Prospect(req.body);
    newClient.save()
        .then(client => {
            res.json({ status: 200, errors: false, data: client, message: "prospect Add Successfull.!" })
        }).catch(err => {
            console.log(err)
            res.json({ status: 500, errors: true, data: null, message: err })
        })
});

router.get('/get_prospect_by_id/:id', (req, res) => {
    if (req.params.id == null) {
        res.json({ status: 500, errors: true, data: null, message: err })
    } else {
        Prospect.findOne({ _id: mongoose.Types.ObjectId(req.params.id) })
            .populate('user_id')
            .then(client => {
                res.json({ status: 200, errors: false, data: client, message: "prospect Details Get Successfull.!" })
            }).catch(err => {
                res.json({ status: 500, errors: true, data: null, message: err })
            })
    }

});

router.put("/prospec_updtae/:id", (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.id)) {
        let result = prospectCtrl.insert(req.body);
        if (!isEmpty(result.errors)) {
            res.status(400).json(result.errors);
        }
        Prospect.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, application) => {
            if (!application) res.status(404).send("data is not found")
            else res.json({ status: 200, errors: false, data: application, message: "Prospec Update Successfull.!" })

        })
    } else res.send("ID NOT FOUND");
});

router.get('/get_all_product', (req, res) => {
    if(req.user){
        Prospect.find({ user_id: mongoose.Types.ObjectId(req.user._id) })
                .then(client => {
                    res.json({ status: 200, errors: false, data: client, message: "prospect Details Get Successfull.!" })
                }).catch(err => {
                    res.json({ status: 500, errors: true, data: null, message: err })
                })
    }else res.send("PRODUCT NOT FOUND");

});

module.exports = router;
