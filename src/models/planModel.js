import mongoose from "mongoose";
const planSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    minAmount: {
      type: Number,
      default: 0,
    },
    maxAmount: {
      type: Number,
      default: 0,
    },
    returnRate: {
      type: Number,
      default: 0,
    },
    durationId: [{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Duration"
    }],
    agentCommission: {
      type: Number,
      default: 0,
    },
    teamLeaderCommission: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Plan = mongoose.model("Plan", planSchema);
export default Plan;


const createDeafaultPlans = async () => {
  const plans = [
    {
      _id: "684690a1a98bf6557574a0a1",
      title: "Monthly Incentive Plan",
      description:
        "In the Monthly Incentive Plan, you will receive a 6% return every month, which will be credited to your wallet and can be withdrawn. After the investment matures (i.e., once the duration is complete), the full invested amount will be credited to your wallet and can also be withdrawn.",
      minAmount: 100,
      returnRate: 6,
      image:
        "https://leadkart.in-maa-1.linodeobjects.com/ATTACH_IMAGE/IMAGE/1749792091563_MI.png",
      durationId: ["68303e8fa6483bde3f8941e0"],
      agentCommission: 600,
      teamLeaderCommission: 600,
    },
    {
      _id: "6846a2fd442007e055d0c912",
      title: "Fixed Duration Plan",
      description:
        "In the Fixed Duration Plan, you will receive an 8% return. After the investment matures, the total amount (invested amount + 8% returns) will be credited to your wallet, which you can withdraw to your bank account.",
      minAmount: 100,
      returnRate: 8,
      image:
        "https://leadkart.in-maa-1.linodeobjects.com/ATTACH_IMAGE/IMAGE/1749792051870_FD.png",
      durationId: ["68303e8fa6483bde3f8941e0"],
      agentCommission: 600,
      teamLeaderCommission: 600,
    },
    {
      _id: "6846a34f442007e055d0c914",
      title: "Daily Deposite Plan",
      description:
        "In the Daily Deposit Plan, you earn a 7% return. If you choose the cash payment method, an agent will visit you daily to collect the payment. Once the investment matures (i.e., after the duration is complete), the total amount (invested amount + 7% returns) will be credited to your wallet, which you can then withdraw to your bank account.",
      minAmount: 100,
      returnRate: 7,
      image:
        "https://leadkart.in-maa-1.linodeobjects.com/ATTACH_IMAGE/IMAGE/1749791849709_DD.png",
      durationId: [
        "68303e8fa6483bde3f8941e0",
        "683042bd50c9acce1fc06785",
        "683043dd50c9acce1fc0678a",
        "68304a2e50c9acce1fc06791",
      ],
      agentCommission: 600,
      teamLeaderCommission: 600,
    },
    {
      _id: "6846a399442007e055d0c916",
      title: "Monthly Deposite Plan",
      description:
        "In the Monthly Deposit Plan, you earn a 9% return. If you choose the cash payment method, an agent will visit you monthly to collect the payment. Once the investment matures (i.e., after the duration is complete), the total amount (invested amount + 9% returns) will be credited to your wallet, which you can then withdraw to your bank account.",
      minAmount: 100,
      returnRate: 9,
      image:
        "https://leadkart.in-maa-1.linodeobjects.com/INTEGRITY/IMAGE/1749791728380_MD.png",
      durationId: [
        "68303e8fa6483bde3f8941e0",
        "683042bd50c9acce1fc06785",
        "683043dd50c9acce1fc0678a",
        "68304a2e50c9acce1fc06791",
      ],
      agentCommission: 600,
      teamLeaderCommission: 600,
    },
  ];

  const existingCount = await Plan.countDocuments();

  if (existingCount === 0) {
    await Plan.insertMany(plans);
    console.log("Default plans created successfully.");
  } else {
    console.log("Default plans already exist.");
  }
};

export { createDeafaultPlans };
