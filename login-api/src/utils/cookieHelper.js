const cookieParser = require("cookie-parser");

const ONE_HOUR_SECONDS = 3600;

module.exports.init = () =>
  cookieParser("secret-to-change", {
    maxAge: ONE_HOUR_SECONDS,
    sameSite: "none",
  });

module.exports.setCookie = (res, name, value) =>
  res.cookie(name, value, {
    httpOnly: true,
    secure: false,
    maxAge: 70000,
    signed: true,
  });

module.exports.getCookie = (req, name) => req.signedCookies[name];
