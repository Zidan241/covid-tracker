// Import express
const express = require("express");
const app= express();
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();
const bodyParser = require('body-parser');
const path = require('path');

const origin=['https://covid-tracker-nodogoro.herokuapp.com','http://localhost:3000', 'http://localhost:5000']
app.use(cors({
  origin:origin,
  credentials: true,
  optionSuccessStatus:200
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//Require Route Handlers
const auth = require("./routes/api/auth");
const temp = require("./routes/api/temp");
app.use("/api/auth", auth);
app.use("/api/temp", temp);

//Getting Mongo's connection URI
const db = process.env.MONGODB_URI;
//Connecting to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));


if (process.env.NODE_ENV==='production') {
  app.use(express.static('../client/build'));
  app.get("*", (req, res) =>{
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));                    
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () =>{
  console.log(`Server up and running on port ${port}`);
});
