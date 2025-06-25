import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
    },
    title: String,
    description: String,

    minAmount: {
      type: Number,
      default: 0,
    },
    returnRate: {
      type: Number,
      default: 0,
    },

    durationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Duration",
    },
    totalMonth: {
      type: Number,
      default: 0,
    },
    currentMonthPassed: {
      type: Number,
      default: 0,
    },

    payAmount: {
      type: Number,
      default: 0,
    },
    totalPay: {
      type: Number,
      default: 0,
    },

    // Indicates if plan pays incentive monthly or not
    isMonthlyIncentive: {
      type: Boolean,
      default: false,
    },

    // Monthly incentive amount per month (for Monthly Incentive Plan)
    monthlyIncentiveAmount: {
      type: Number,
      default: 0,
    },

    // Final amount to be credited at maturity (Principal or Principal+Return)
    maturityReturnAmount: {
      type: Number,
      default: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["CASH", "AUTOPAY"],
    },

    purchasePlanStartDate: {
      type: Date,
      default: Date.now,
    },
    purchasePlanEnd: {
      type: Date,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Purchase = mongoose.model("Purchase", purchaseSchema);
export default Purchase;
