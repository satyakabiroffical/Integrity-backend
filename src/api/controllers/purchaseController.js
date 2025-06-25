import purchaseModel from "../../models/purchaseModel.js";
import planModel from "../../models/planModel.js";
import durationModel from "../../models/durationModel.js";
import User from "../../models/userModel.js";
import cron from "node-cron";

//const myDate = "2024-01-15"; // or Date.now() or new Date("2024-01-15")
//const months = 18;
// add month in date
function addMonthsToDate(givenDate, monthsToAdd) {
  const date = new Date(givenDate);
  date.setMonth(date.getMonth() + monthsToAdd);
  return date;
}

export const createPurchase = async (req, res) => {
  try {
    const {
      userId,
      planId,
      durationId,
      payAmount,
      paymentMethod,
      purchasePlanStartDate,
    } = req.body;

    if (!userId || !planId || !durationId || !payAmount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message:
          "userId, planId, durationId, payAmount, and paymentMethod are required",
      });
    }

    const [planData, duration, user] = await Promise.all([
      planModel.findById(planId),
      durationModel.findById(durationId),
      User.findById(userId),
    ]);

    if (!planData || !duration || !user) {
      return res.status(404).json({
        success: false,
        message: "Plan, duration, or user not found",
      });
    }

    // Check min amount
    if (payAmount < planData.minAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum investment should be ₹${planData.minAmount}`,
      });
    }

    // Check wallet balance
    if (user.wallet < payAmount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient wallet balance",
      });
    }

    // Deduct from wallet
    user.totalBalance -= payAmount;
    user.investment += payAmount;

    // Calculate values
    const planTitle = planData.title;
    const returnRate = planData.returnRate;
    const months = duration.durationInMonths;
    const startDate = purchasePlanStartDate
      ? new Date(purchasePlanStartDate)
      : new Date();
    const endDate = addMonthsToDate(startDate, months);

    let isMonthlyIncentive = false;
    let monthlyIncentiveAmount = 0;
    let maturityReturnAmount = 0;

    if (planTitle === "Monthly Incentive Plan") {
      isMonthlyIncentive = true;
      monthlyIncentiveAmount = payAmount * (returnRate / 100); // e.g., 6% monthly
      maturityReturnAmount = payAmount; // only principal
    } else {
      // One-time return
      isMonthlyIncentive = false;
      maturityReturnAmount = payAmount + payAmount * (returnRate / 100);
    }

    const purchaseData = await purchaseModel.create({
      userId,
      planId,
      title: planData.title,
      description: planData.description,
      minAmount: planData.minAmount,
      returnRate,
      durationId,
      totalMonth: months,
      currentMonthPassed: 0,
      payAmount,
      totalPay: payAmount,
      isMonthlyIncentive,
      monthlyIncentiveAmount,
      maturityReturnAmount,
      paymentMethod,
      purchasePlanStartDate: startDate,
      purchasePlanEnd: endDate,
      active: true, // Plan is active on creation
    });

    user.totalPackage += 1;
    user.activePackage += 1;
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Purchase created successfully",
      data: purchaseData,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};



export const getAllPurchaseByFilter = async (req, res) => {
  const { page = 1, limit = 20, sort = -1, active } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const filter = {
    ...(active && { active }),
  };
  try {
    const data = await purchaseModel
      .find(filter)
      .sort({ createdAt: parseInt(sort) })
      .skip(skip)
      .limit(limit);
    const total = await purchaseModel.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "All Package Fetched Successfully",
      data: data,
      currentPage: page,
      page: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Check if monthly incentive is due
function isMonthlyIncentiveDue(startDate, passedMonths) {
  const dueDate = new Date(startDate);
  dueDate.setMonth(dueDate.getMonth() + passedMonths);

  const today = new Date();
  return (
    today.getDate() === dueDate.getDate() || // Same day of month
    today > dueDate // Or passed due day
  );
}

// Run daily via cron
export const processIncentivesAndMaturities = async () => {
  const today = new Date();

  // Only check active plans to optimize
  const purchases = await purchaseModel.find({ active: true });

  for (const purchase of purchases) {
    const {
      _id,
      isMonthlyIncentive,
      currentMonthPassed,
      totalMonth,
      monthlyIncentiveAmount,
      maturityReturnAmount,
      purchasePlanEnd,
      userId,
      purchasePlanStartDate,
    } = purchase;

    const user = await User.findById(userId);
    if (!user) continue;

    // 1️⃣ Maturity: credit once when plan ends
    if (today >= new Date(purchasePlanEnd)) {
      if (maturityReturnAmount > 0) {
        user.totalBalance += maturityReturnAmount;
        user.profit += Number(purchase.totalPay - maturityReturnAmount);
        user.activePackage -= 1;

        purchase.maturityReturnAmount = 0;
        purchase.active = false; // Plan is now inactive
        await purchase.save();
        await user.save();

        console.log(`Maturity credited to user ${userId}`);
        continue; // skip rest, since plan is done
      }
    }

    // 2️⃣ Monthly Incentive: only if due this month
    if (
      isMonthlyIncentive &&
      currentMonthPassed < totalMonth &&
      isMonthlyIncentiveDue(purchasePlanStartDate, currentMonthPassed)
    ) {
      user.totalBalance += monthlyIncentiveAmount;
      user.activePackage -= 1;
      purchase.currentMonthPassed += 1;

      await user.save();
      await purchase.save();

      console.log(`Monthly incentive given to user ${userId}`);
    }

    // 3️⃣ Auto-deactivate if all incentives paid and no maturity remains
    if (
      isMonthlyIncentive &&
      currentMonthPassed >= totalMonth &&
      maturityReturnAmount === 0 &&
      purchase.active
    ) {
      purchase.active = false;
      await purchase.save();

      console.log(
        ` Plan deactivated after full incentive payout for user ${userId}`
      );
    }
  }
};

// every day at midnight.
cron.schedule("0 0 * * *", () => {
  console.log("Running daily incentive & maturity check...");
  processIncentivesAndMaturities();
});
