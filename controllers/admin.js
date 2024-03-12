const adminService = require("../services/admin");
const HttpError = require("../http.error");

const getClientComplaintCategories = async (req, res, next) => {
  const userId = req.params.userId; 
  try {
    const categories = await adminService.getClientComplaintCategories(userId);
    res.status(200).json(categories);
  } catch (error) {
    next(new HttpError("Failed to fetch complaint categories", 500));
  }
};

const getClientComplaintCategoryDetails = async (req, res, next) => {
  const userId = req.params.userId; 
  const categoryId = req.params.categoryId; 
  try {
    const categoryDetails = await adminService.getClientComplaintCategoryDetails(userId, categoryId);
    res.status(200).json(categoryDetails);
  } catch (error) {
    next(new HttpError("Failed to fetch complaint category details", 500));
  }
};

const addComplaintCategory = async (req, res, next) => {
  const { category } = req.body;
  try {
    const newCategory = await adminService.addComplaintCategory(category);
    res.status(201).json(newCategory);
  } catch (error) {
    next(new HttpError("Failed to add complaint category", 500));
  }
};

const updateComplaintCategory = async (req, res, next) => {
  const categoryId = req.params.id;
  const { category } = req.body;
  try {
    const updatedCategory = await adminService.updateComplaintCategory(categoryId, category);
    res.status(200).json(updatedCategory);
  } catch (error) {
    next(new HttpError("Failed to update complaint category", 500));
  }
};

const deleteComplaintCategory = async (req, res, next) => {
  const categoryId = req.params.id;
  try {
    await adminService.deleteComplaintCategory(categoryId);
    res.status(200).json({ message: "Complaint category deleted successfully" });
  } catch (error) {
    next(new HttpError("Failed to delete complaint category", 500));
  }
};

const getAllClientsComplaints = async (req, res, next) => {
  const filters = req.query; 
  try {
    const complaints = await adminService.getAllClientsComplaints(filters);
    res.status(200).json(complaints);
  } catch (error) {
    next(new HttpError("Failed to fetch clients' complaints", 500));
  }
};

const updateComplaintStatus = async (req, res, next) => {
  const complaintId = req.params.id;
  const { newStatus } = req.body;
  try {
    const updatedComplaint = await adminService.updateComplaintStatus(complaintId, newStatus);
    res.status(200).json(updatedComplaint);
  } catch (error) {
    next(new HttpError("Failed to update complaint status", 500));
  }
};

module.exports = {
  getClientComplaintCategories,
  getClientComplaintCategoryDetails,
  addComplaintCategory,
  updateComplaintCategory,
  deleteComplaintCategory,
  getAllClientsComplaints,
  updateComplaintStatus,
};