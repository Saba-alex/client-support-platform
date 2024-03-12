const express = require('express');
const router = express.Router();
const { check } = require("express-validator");
const complaintControllers = require('../controllers/complaint');
const checkAuth = require('../middleware/check-auth');

const complaintValidation = [
    check('title').trim().not().isEmpty(),
    check('description').trim().not().isEmpty(),
    check('categories').isArray({ min: 1 }),
];

router.post('/', checkAuth, complaintValidation, complaintControllers.submitComplaint);
router.get('/', checkAuth, complaintControllers.getMyComplaints);
router.get('/:id', checkAuth, complaintControllers.getComplaintDetails);
router.delete('/:id', checkAuth, complaintControllers.deleteComplaint);

module.exports = router;