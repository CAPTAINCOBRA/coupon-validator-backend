const express = require("express");
const {
  createCoupon,
  validateCoupon,
  fetchAllCoupons,
} = require("../controllers/coupons");
const router = express.Router();
const Coupon = require("../models/coupon");

const logger = require("../myLogger");

router.post("/createCoupon", createCoupon);

router.get("/fetchAllCoupons", fetchAllCoupons);

router.post("/validateCoupon", validateCoupon);

module.exports = router;
