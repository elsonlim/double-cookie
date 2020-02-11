const express = require("express");
const UserModel = require("../models/User");
const jwt = require("jsonwebtoken");
const cookieHelper = require("../utils/cookieHelper");
const crypto = require("crypto");

const router = express.Router();

const errorCatcher = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post(
  "/create",
  errorCatcher(async (req, res) => {
    const { username, password } = req.body;

    const user = await UserModel.create({
      username,
      password,
    });
    const token = await user.generateJWT();

    const xsrfToken = crypto.randomBytes(16).toString("hex");
    cookieHelper.setCookie(res, "auth", token);
    cookieHelper.setCookie(res, "XSRF-TOKEN", xsrfToken);

    console.log("Cookies: ", req.cookies);
    console.log("Signed Cookies: ", req.signedCookies);

    res.json({
      "XSRF-TOKEN": xsrfToken,
    });
  }),
);

router.post(
  "/login",
  errorCatcher(async (req, res) => {
    const { username, password } = req.body;

    const user = await UserModel.findOne({
      username,
    });
    if (user) {
      const match = await user.comparePassword(password);
      if (match) {
        const token = await user.generateJWT();

        const xsrfToken = crypto.randomBytes(16).toString("hex");
        cookieHelper.setCookie(res, "auth", token);
        cookieHelper.setCookie(res, "XSRF-TOKEN", xsrfToken);

        console.log("token", xsrfToken);
        console.log("Cookies: ", req.cookies);
        console.log("Signed Cookies: ", req.signedCookies);

        return res.json({
          "XSRF-TOKEN": xsrfToken,
        });
      }
    }

    res.sendStatus(401);
  }),
);

router.get(
  "/info",
  errorCatcher(async (req, res, next) => {
    console.log("hello");
    const authorization = cookieHelper.getCookie(req, "auth");
    const token = authorization;
    const jwtInfo = jwt.verify(token, process.env.JWT_PW, {
      ignoreExpiration: false,
    });

    const cookieXSRF = cookieHelper.getCookie(req, "XSRF-TOKEN");
    const headerXSRF = req.header("X-XSRF-TOKEN");

    console.log("headerXSRF: ", headerXSRF);
    console.log("Cookies: ", req.cookies);
    console.log("Signed Cookies: ", req.signedCookies);

    if (cookieXSRF === headerXSRF) {
      return res.send(jwtInfo.name);
    }

    next(
      new Error({
        httpStatus: 401,
      }),
    );
  }),
);

module.exports = router;
