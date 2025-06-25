import mongoose from "mongoose";

const transactionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
    },
    amount: {
      type: String,
    },
    transactionId: {
      type: String,
      trim: true,
    },
    transactionType: {
      type: String,
      enum: ["CREDIT", "DEBIT", "PACKAGE_COMMISSION", "PACKAGE_PURCHASE"],
	},
    status: {
      type: String,
      enum: ["CONFIRMED", "PENDING", "CANCELED", "TRANSFERED", "CREDITED"],
      default:"PENDING"
    },

  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;



