const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    isVip:boolean,
    isAdmin:boolean,
  
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);