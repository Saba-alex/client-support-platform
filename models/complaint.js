const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const complaintSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    categories: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["PENDING", "INPROGRESS", "RESOLVED", "REJECTED"],
      default: "PENDING",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;
