const util = require("util");
const path = require("path");
const multer = require("multer");
const fs = require("fs"); 

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    var innerFolder = req.body.applicationType === 'lmia' ? 'lmia_docs' : 'application_docs';
    const filePath = path.join(`${__dirname}/../../resources/static/assets/uploads/${innerFolder}/${req.body.applicationId}`);
    if (!fs.existsSync(filePath)){
        fs.mkdirSync(filePath, { recursive: true });
    }
    callback(null, filePath);
  },
  filename: (req, file, callback) => {
    const match = ["image/png", "image/jpeg", "imgage/pjpeg", "image/gif", "text/plain", "application/pdf", "application/msword"];

    if (match.indexOf(file.mimetype) === -1) {
      var message = `${file.name} is invalid. Only accept .png/.jpg/.jpeg/.gif/.txt/.pdf/.doc files.`;
      return callback(message, null);
    }

    var filename = file.originalname.split('___')[1];
    callback(null, filename);
  }
});

var uploadFiles = multer({ storage: storage }).array("files", 20);
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;