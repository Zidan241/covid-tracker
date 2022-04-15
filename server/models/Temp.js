const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TempSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  long:{
    type:Number,
    required: true
  },
  lat:{
    type:Number,
    required: true
  },
  temp :{
    type:Number,
    required: true
  },
  comment :{
    type: String,
  },
  creationDate : {
    type : Date,
    default: new Date()
  },
  deleted : {
    type : Boolean,
    default:false
  },
  deletedOn : {
      type : Date,
  }
});

module.exports = Temp = mongoose.model('Temp', TempSchema);
