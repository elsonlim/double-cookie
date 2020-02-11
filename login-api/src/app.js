require("dotenv").config();
require("./utils/db");

const express = require("express");
const morgan = require("morgan");
const userRoute = require("./routes/user.route");
const cookieHelper = require("./utils/cookieHelper");
const cors = require("cors");

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:3001"],
  }),
);
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieHelper.init());

app.use("/user", userRoute);

app.use((err, req, res, next) => {
  console.log(err.message);
  res.sendStatus(500);
});

module.exports = app;
