const express = require('express');
const router = express.Router();
const authController = require("../../controllers/authController");

router.get("/registerCheck/:email", authController.registerCheck);
router.post("/register", authController.register);

module.exports = router;  