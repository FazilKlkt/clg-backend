const express = require('express');
const router = express.Router();
const {
    addUser,
    getUser,
    getAllUser,
    checkPass,
    updatePassSendOtp,
    updatePassCheckOtp
} = require("../controllers/userController");

router.post("/", addUser);
router.get("/", getAllUser);
router.put("/updatePassSendOtp",updatePassSendOtp);
router.put("/updatePassCheckOtp",updatePassCheckOtp);
router.get("/checkPass",checkPass);
router.get("/:id", getUser);

module.exports = router;