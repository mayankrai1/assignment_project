const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

module.exports = async (req, res, next) => {
    console.log('llllll user time')
    if (req.headers.token) {
        if (typeof req.headers.token == "string" && req.headers.token.trim() !== "") {
            jwt.verify(req.headers.token, process.env.JWT_SECRET, (err, payload) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid token" })
                } else {
                    User.findById(payload._id).populate("position").exec().then(d => {
                        if (d) {
                            let u = d.toObject();
                            delete u.password;
                            req.user = u;
                            next();
                        } else {
                            console.log(d);
                            res.status(403).json({ status: 403, data: null, errors: true, message: "Your Token is not valid anymore" });
                        }
                    }).catch(e => {
                        if (e) {
                            return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while retriving user details" })
                        }
                    });
                }
            })
        } else {
            res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid token" })
        }
    } else {
        res.status(401).json({ status: 401, data: null, errors: true, message: "Unauthorized" })
    }
}
