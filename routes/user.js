const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const userControllers = require('../controllers/user')

const userValidation = [
    check('firstName').trim().not().isEmpty(),
    check('lastName').trim().not().isEmpty(),
    check('email').isEmail().normalizeEmail().not().isEmpty().withMessage('Please enter a valid email'),
    check('password').trim().isLength({min: 5}).not().isEmpty(),
    check('isAdmin').optional(),
    check('isVip').optional()
];


router.post("/signup", userValidation ,userControllers.signup);
router.post("/login", userControllers.login);
router.post('/forget-password', userControllers.forgetPassword);
router.post('/verify-otp', userControllers.verifyOTP);
router.post('/resend-otp', userControllers.resendOTP);
router.post('/reset-password', userControllers.resetPassword);
router.post('/change-password', authMiddleware, userControllers.changePassword);


module.exports = router;