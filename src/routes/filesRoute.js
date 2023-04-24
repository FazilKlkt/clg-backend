const express = require('express');
const router = express.Router();
const multer = require('multer')
const {
    listUserFiles,
    deleteFile,
    uploadFile
} = require("../controllers/fileController")


const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage, limits: { fileSize: 40 * 1024 * 1024 } });



router.post("/upload", upload.single('file'), uploadFile);
router.delete("/", deleteFile);
router.get("/", listUserFiles);

// const {
//     uploadFile,
//     getListFiles,
//     download,
//     remove
// } = require("../controllers/fileController");

// router.post("/upload", uploadFile);
// router.get("/:name",download);
// router.get("/", getListFiles);
// router.delete("/:name",remove);

module.exports = router;