const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SALT_FACTOR = 10;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(SALT_FACTOR);
    if (!salt) {
      throw new Error("fail to generate salt");
    }

    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generateJWT = async function() {
  const token = await jwt.sign(
    {
      name: this.username,
      iat: Math.floor(Date.now() / 1000),
    },
    process.env.JWT_PW,
    {
      expiresIn: "10m",
    },
  );
  return token;
};

module.exports = mongoose.model("User", UserSchema);
