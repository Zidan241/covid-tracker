const express = require('express');
const router = express.Router();
const tempController = require("../../controllers/tempController");
const verify = require('../../authentication/tokenVerification');

//protected route
router.post("/submitTemp", verify, tempController.submitTemp);
router.get("/getMyTemps", verify, tempController.getMyTemps);
router.get("/getAllTemps", verify, tempController.getAllTemps);
router.delete("/deleteTemp/:tempId", verify, tempController.deleteTemp);

module.exports = router; 