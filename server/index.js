// Import express
const express = require("express");
const app= express();
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();

const origin=['http://localhost:3000', 'http://localhost:5000']
app.use(cors({
  origin:origin,
  credentials: true,
  optionSuccessStatus:200
}));

//Require Route Handlers
const auth = require("./routes/api/auth");
app.use("/api/auth", auth);

//Getting Mongo's connection URI
const db = process.env.MONGODB_URI;
//Connecting to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const port = process.env.PORT || 5000;
app.listen(port, () =>{
  console.log(`Server up and running on port ${port}`);
});
