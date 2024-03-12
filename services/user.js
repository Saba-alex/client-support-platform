const User = require("../models/user");
const HttpError = require("../http.error");

const findUserByEmail = async (email) => {
  const userEmail = await User.findOne({ email });
  if (!userEmail) {
    const error = new HttpError("user not found", 500);
    throw error;
  }
  return userEmail;
};

const signup = async (firstName, lastName, email, password, isVip, isAdmin) => {
  const createdUser = new User({
    firstName,
    lastName,
    email,
    password,
    isVip,
    isAdmin,
  });
  await createdUser.save();

  if (!createdUser) {
    const error = new HttpError("Could not create a user", 500);
    throw error;
  }

  return createdUser;
};

const login = async (email, password) => {
  const user = await User.findOne({ email, password });

  if (!user) {
    const error = new HttpError("Could not login a user", 500);
    throw error;
  }

  return user;
};

const forgetPassword = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) {
    const error = new HttpError("User not found", 404);
    throw error;
  }

  return { message: "OTP sent successfully" };
};

const verifyOTP = async (email, enteredOTP) => {
  const user = await findUserByEmail(email);
  if (!user) {
    const error = new HttpError("User not found", 404);
    throw error;
  }

  if (user.otp === enteredOTP) {
    return { message: "OTP verified successfully" };
  } else {
    const error = new HttpError("Invalid OTP", 422);
    throw error;
  }
};

const resendOTP = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) {
    const error = new HttpError("User not found", 404);
    throw error;
  }

  return { message: "New OTP sent successfully" };
};

const resetPassword = async (email, newPassword) => {
  const user = await findUserByEmail(email);
  if (!user) {
    const error = new HttpError("User not found", 404);
    throw error;
  }

  user.password = newPassword;
  await user.save();

  return { message: "Password reset successfully" };
};

const changePassword = async (userId, newPassword) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new HttpError("User not found", 404);
    }
    user.password = newPassword;
    await user.save();
  } catch (error) {
    throw new HttpError("Failed to change password", 500);
  }
};

exports.findUserByEmail = findUserByEmail;
exports.signup = signup;
exports.login = login;
exports.forgetPassword = forgetPassword;
exports.verifyOTP = verifyOTP;
exports.resendOTP = resendOTP;
exports.resetPassword = resetPassword;
exports.changePassword = changePassword;
