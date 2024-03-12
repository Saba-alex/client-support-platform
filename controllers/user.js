const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userService = require("../services/user");
const HttpError = require("../http.error");

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { firstName, lastName, email, password } = req.body;
  const isVIP = req.body.isVIP || false;
  const isAdmin = req.body.isAdmin || false;

  let existingUser;
  try {
    existingUser = await userService.findUserByEmail(email);
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create a user, please try again ",
      500
    );
    return next(error);
  }
  const createdUser = userService.signup(
    firstName,
    lastName,
    email,
    hashedPassword,
    isVIP,
    isAdmin
  );

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email, isAdmin: isAdmin },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }
  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await userService.findUserByEmail(email);
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  let isValidPassword = false;

  try {
    isValidPassword = bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Logging in failed, please try again.", 500);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    isAdmin: existingUser.isAdmin,
    token: token,
  });
};

const forgetPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await userService.findUserByEmail(email);

    const otp = generateOTP();

    const mailOptions = {
      from: `${process.env.EMAIL_key}`,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        throw new HttpError("Error sending OTP", 500);
      } else {
        console.log("Email sent: " + info.response);
        user.otp = otp;
        user.save();
        res.status(200).json({ message: "OTP sent successfully" });
      }
    });
  } catch (error) {
    return next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const user = await userService.findUserByEmail(email);

    if (user.otp === otp) {
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      throw new HttpError("Invalid OTP", 422);
    }
  } catch (error) {
    return next(error);
  }
};

const resendOTP = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await userService.findUserByEmail(email);

    const otp = generateOTP();

    const mailOptions = {
      from: `${process.env.EMAIL_KEY}`,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        throw new HttpError("Error sending OTP", 500);
      } else {
        console.log("Email sent: " + info.response);
        user.otp = otp;
        user.save();
        res.status(200).json({ message: "New OTP sent successfully" });
      }
    });
  } catch (error) {
    return next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const { email, newPassword } = req.body;

  try {
    await userService.resetPassword(email, newPassword);
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return next(error);
  }
};

const changePassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input. Please check your data.", 422));
  }

  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const passwordMatch = await bcrypt.compare(
      currentPassword,
      req.user.password
    );
    if (!passwordMatch) {
      return next(new HttpError("Current password is incorrect", 403));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await userService.changePassword(userId, hashedPassword);
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: `${process.env.EMAIL_KEY}`,
    pass: `${process.env.EMAILPASS_KEY}`,
  },
});

exports.signup = signup;
exports.login = login;
exports.forgetPassword = forgetPassword;
exports.verifyOTP = verifyOTP;
exports.resendOTP = resendOTP;
exports.resetPassword = resetPassword;
exports.changePassword = changePassword;
