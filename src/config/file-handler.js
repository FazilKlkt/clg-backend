const util = require("util");
const multer = require('multer');
const maxSize = 40 * 1024 * 1024;
const path = require('path');

const storage = multer.diskStorage({
    destination: __basedir + '/resources/static/assets/uploads',
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

const multerFilter = (req, file, cb) => {
    console.log("file");
    // TODO: SAVE DATA TO DB BEFORE UPLOADING
    var ext = path.extname(file.originalname);
    if (ext !== '.pdf' && ext !== '.doc' && ext !== '.docx' && ext !== '.xlsx' && ext !== '.xls' && ext !== '.odt' && ext !== '.zip' && ext !== '.txt') {
        return cb(new Error('not an Document'), false)
    }
    cb(null, true)
};

const uploadFileMiddleware = multer({
    storage: storage,
    fileFilter: multerFilter,
    limits: { fileSize: maxSize },
}).single('file');

const upload = util.promisify(uploadFileMiddleware);
module.exports = { upload };
