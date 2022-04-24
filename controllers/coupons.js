const Coupon = require("../models/coupon");
const logger = require("../myLogger");

exports.createCoupon = async (req, res) => {
  logger.info("LOG: Create coupon");

  req.body = JSON.parse(req.body.data);

  const {
    couponValue,
    couponCode,
    minOrderValue,
    couponStartDate,
    couponExpiryDate,
    couponType,
  } = req.body;

  const coupon = new Coupon({
    couponValue,
    couponCode,
    minOrderValue,
    couponStartDate,
    couponExpiryDate,
    couponType,
  });

  try {
    await coupon.save();
    res.json({
      message: "Coupon created successfully",
      status: 201,
      coupon,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.fetchAllCoupons = async (req, res) => {
  logger.info("LOG: Fetch all coupons");
  try {
    const coupons = await Coupon.find();
    res.send(coupons);
  } catch (error) {
    console.log(error);
    logger.error("LOG: Error in server fetch coupons catch");
    res.status(500).send(error);
  }
};

const compareDateBetweenDates = (startDate, endDate) => {
  const currentDate = new Date(Date.now());
  const startDate1 = new Date(startDate);
  const endDate1 = new Date(endDate);
  if (
    currentDate.getTime() >= startDate1.getTime() &&
    currentDate.getTime() <= endDate1.getTime()
  ) {
    return true;
  } else {
    return false;
  }
};

exports.validateCoupon = async (req, res) => {
  logger.info("LOG: Validate coupon");
  req.body = JSON.parse(req.body.data);

  const { discountValue, orderValue } = req.body;

  try {
    const coupon = await Coupon.findOne({ couponCode: discountValue });
    if (!coupon) {
      res.status(404).send("Coupon not found");
    } else {
      logger.info("LOG: coupon exists");
      // Now we valdate the coupon
      if (
        compareDateBetweenDates(
          coupon.couponStartDate,
          coupon.couponExpiryDate
        ) === false
      ) {
        logger.info("LOG: Coupon dates are not valid");
        res.json({
          message: "Coupon expired",
          isValid: false,
          status: 400,
        });
      } else if (orderValue <= coupon.minOrderValue) {
        logger.info("LOG: Coupon min order value is not valid");
        res.json({
          message:
            "Coupon not applicable. Order amount is less than minimum order value",
          isValid: false,
        });
      } else {
        let discountAmount = 0;
        if (coupon.couponType === "percentage") {
          discountAmount = (orderValue * coupon.couponValue) / 100;
        } else if (coupon.couponType === "flat") {
          discountAmount = coupon.couponValue;
        }

        res.status(200).json({
          coupon,
          message: "Coupon Applied",
          isValid: true,
          discountAmount: discountAmount,
          priceAfterDiscount: orderValue - discountAmount,
          status: 200,
        });
      }
    }
  } catch (error) {
    logger.error("LOG: Error in server validate catch");
    console.log(error);
    res.status(500).send(error);
  }
};
