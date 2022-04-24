const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

var couponSchema = new mongoose.Schema({
  couponStartDate: Date,
  couponExpiryDate: Date,
  minOrderValue: Number,
  couponType: String,
  couponValue: Number,
  couponCode: String,
});

module.exports = mongoose.model("Coupon", couponSchema);
