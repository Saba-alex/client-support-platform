const complaintService = require("../services/complaint");
const { validationResult } = require("express-validator");
const HttpError = require("../http.error");

const submitComplaint = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { title, description, categories } = req.body;
  const userId = req.user.id;

  try {
    const complaint = await complaintService.submitComplaint(
      title,
      description,
      categories,
      userId
    );
    res
      .status(201)
      .json({ message: "Complaint submitted successfully", complaint });
  } catch (error) {
    next(new HttpError("Failed to submit complaint", 500));
  }
};

const getMyComplaints = async (req, res, next) => {
  const userId = req.user.id;
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  try {
    const complaints = await complaintService.getMyComplaints(
      userId,
      page,
      limit
    );
    res.status(200).json(complaints);
  } catch (error) {
    next(new HttpError("Failed to fetch complaints", 500));
  }
};

const getComplaintDetails = async (req, res, next) => {
  const complaintId = req.params.id;
  const userId = req.user.id;

  try {
    const complaint = await complaintService.getComplaintDetails(
      complaintId,
      userId
    );
    if (!complaint) {
      return next(new HttpError("Complaint not found", 404));
    }
    res.status(200).json(complaint);
  } catch (error) {
    next(new HttpError("Failed to fetch complaint details", 500));
  }
};

const deleteComplaint = async (req, res, next) => {
  const complaintId = req.params.id;
  const userId = req.user.id;

  try {
    await complaintService.deleteComplaint(complaintId, userId);
    res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error) {
    next(new HttpError("Failed to delete complaint", 500));
  }
};


  exports.submitComplaint =submitComplaint;
  exports.getMyComplaints=getMyComplaints;
  exports.getComplaintDetails=getComplaintDetails;
  exports.deleteComplaint=deleteComplaint;

