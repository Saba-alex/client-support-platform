const express = require("express");
const router = express.Router();
const adminControllers = require('../controllers/admin');
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');

router.use(checkAuth); 
router.use(checkAdmin); 


router.get('/complaint-categories/:userId', adminControllers.getClientComplaintCategories);
router.get('/complaint-categories/:userId/:categoryId', adminControllers.getClientComplaintCategoryDetails);
router.post('/complaint-categories', adminControllers.addComplaintCategory);
router.put('/complaint-categories/:id', adminControllers.updateComplaintCategory);
router.delete('/complaint-categories/:id', adminControllers.deleteComplaintCategory);
router.get('/all-clients-complaints', adminControllers.getAllClientsComplaints);
router.put('/update-complaint-status/:id', adminControllers.updateComplaintStatus);

module.exports = router;