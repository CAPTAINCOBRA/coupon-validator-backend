const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const couponRouter = require("./routes/coupons");
const Coupon = require("./models/coupon");

const app = express();
const cors = require("cors");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("./myLogger");

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.get("/", async (req, res) => {
  logger.info("LOG: Main page");
  res.send("Hello World!");
});

app.use("/coupons", couponRouter);

app.listen(process.env.PORT || 7000);
