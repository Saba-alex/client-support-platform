const Complaint = require("../models/complaint");
const HttpError = require("../http.error");

const getClientComplaintCategories = async (userId) => {
  const ClientComplaint = await Complaint.distinct("categories", { userId });
  return ClientComplaint;
};

const getClientComplaintCategoryDetails = async (userId, categoryId) => {
  const ClientComplaintDetails = await Complaint.find({
    userId,
    categories: categoryId,
  });
  return ClientComplaintDetails;
};

const addComplaintCategory = (categoryData) => {
  const newCategory = new Complaint({ categories: categoryData });
  return newCategory.save();
};

const updateComplaintCategory = (categoryId, categoryData) => {
  const category = Complaint.findByIdAndUpdate(
    categoryId,
    { categories: categoryData },
    { new: true }
  );
  return category;
};

const deleteComplaintCategory = (categoryId) => {
  const category = Complaint.findByIdAndDelete(categoryId);
  return category;
};

const getAllClientsComplaints = (filters) => {
  const findclient = Complaint.find(filters);
  return findclient;
};

const updateComplaintStatus = (complaintId, newStatus) => {
  const updateStatus = Complaint.findByIdAndUpdate(
    complaintId,
    { status: newStatus },
    { new: true }
  );
  return updateStatus;
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
