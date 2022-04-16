const express = require('express');
const router = express.Router();
const authController = require("../../controllers/authController");
const verify = require('../../authentication/tokenVerification');

router.get("/registerCheck/:email", authController.registerCheck);
router.post("/register", authController.register);
//protected routes
router.patch("/updateInfo", verify ,authController.updateInfo);

module.exports = router;  