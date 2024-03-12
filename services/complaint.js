const Complaint = require("../models/complaint");
const HttpError = require("../http.error");

const submitComplaint = async (title, description, categories, userId) => {
  const complaint = new Complaint({
    title,
    description,
    categories,
    user: userId,
  });
  await complaint.save();
  return complaint;
};

const getMyComplaints = async (userId, page, limit) => {
  const complaints = await Complaint.find({ user: userId })
    .skip((page - 1) * limit)
    .limit(limit);
    
  return complaints;
};

const getComplaintDetails = async (complaintId, userId) => {
  const complaint = await Complaint.findOne({
    _id: complaintId,
    user: userId,
  })
  return complaint;
};

const deleteComplaint = async (complaintId, userId) => {
  await Complaint.findOneAndDelete({ _id: complaintId, user: userId });
};

  exports.submitComplaint =submitComplaint;
  exports.getMyComplaints=getMyComplaints;
  exports.getComplaintDetails=getComplaintDetails;
  exports.deleteComplaint=deleteComplaint;
