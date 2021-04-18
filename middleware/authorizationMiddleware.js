module.exports = (privilege) => {
    return (req, res, next) => {
        if (req.user.position) {
            if (req.user.position && req.user.position.privileges[privilege]) {
                console.log("Authorized : ", req.user.position.privileges[privilege]);
                next();
            } else {
                console.log("Authorized : ", req.user.position.privileges[privilege]);
                res.json({ status: 403, data: null, error: true, message: "Forbidden" });
            }
        }
    }
}