const express = require('express');
const router = express.Router();
const tempController = require("../../controllers/tempController");
const verify = require('../../authentication/tokenVerification');

//protected route
router.post("/submitTemp", verify, tempController.submitTemp);
router.post("/getMyTemps", verify, tempController.getMyTemps);
router.post("/getAllTemps", verify, tempController.getAllTemps);

module.exports = router; 