const express = require('express');
const router = express.Router();
const tempController = require("../../controllers/tempController");
const verify = require('../../authentication/tokenVerification');

//protected route
router.post("/submitTemp", verify, tempController.submitTemp);

module.exports = router; 