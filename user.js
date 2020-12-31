var mongoose = require("mongoose");
var Schema = mongoose.Schema;

UserSchema = new Schema({
  username:{
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 50,
    trim: true
  },
  password:{
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  }
})

Users = mongoose.model("users", UserSchema);
module.exports = Users;


