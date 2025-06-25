import Transaction from "../../models/transactionModel.js";
import asyncHandler from "../../utils/asyncHandler.js";
import userModel from "../../models/userModel.js";
import mongoose from "mongoose";



export const createTransaction = asyncHandler(async (req, res) => {
  const { userId, amount, transactionId, transactionType } = req.body;

  if (!userId || !amount || !transactionId || !transactionType) {
    return res.status(400).json({
      success: false,
      message:
        "All Fields userId, amount, transactionId and transactionType required !",
    });
  }

  const user = await userModel.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Invalid Credentials !",
    });
  }

  let transaction;
  if (transactionType == "CREDIT"  || transactionType == "PACKAGE_COMMISSION") {
    transaction = await Transaction.create({
      userId,
      amount,
      transactionId,
      transactionType,
      status: "CREDITED",
    });
    user.totalBalance += Number(amount);
    await user.save();
  } else if(transactionType == "DEBIT") {
    transaction = await Transaction.create({
      userId,
      amount,
      transactionId,
      transactionType,
    });
    user.totalBalance -= Number(amount);
    user.withdrawalAmount += Number(amount);
    await user.save();
  }else if(transactionType == "PACKAGE_PURCHASE"){
      transaction = await Transaction.create({
      userId,
      amount,
      transactionId,
      transactionType,
      status:"CONFIRMED"
    });
    user.totalBalance -= Number(amount);
        await user.save();

  }

  return res.status(200).json({
    success: true,
    message: "Transaction Created Successfully",
    data: transaction,
  });
});



export const getTransactionById = asyncHandler(async (req, res) => {
  const { transactionId } = req.query;

  if (!transactionId) {
    return res.status(400).json({
      success: false,
      message: "Transaction Id is required",
    });
  }

  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    return res.status(404).json({
      success: false,
      message: "Transaction not found.",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Transaction Fetched Successfully",
    data: transaction,
  });
});

export const getAllTransaction = asyncHandler(async (req, res) => {
  const { page = 1, sort = -1, limit = 20, search } = req.query;
  const skip = (page - 1) * limit;

  const orFilters = [
    { amount: new RegExp(search, "i") },
    { transactionId: new RegExp(search, "i") },
    { transactionType: new RegExp(search, "i") },
    { status: new RegExp(search, "i") },
  ];

  if (mongoose.Types.ObjectId.isValid(search)) {
    orFilters.push({ userId: search });
  }

  const filter = {
    ...(search && { $or: orFilters }),
  };

  const data = await Transaction.find(filter)
    .sort({ createdAt: parseInt(sort) })
    .skip(skip)
    .limit(limit);
  const total = await Transaction.countDocuments(filter);

  return res.status(200).json({
    success: true,
    message: "All Transaction Fetched Successfully",
    data: data,
    currentPage: page,
    page: Math.ceil(total / limit),
  });
});

export const transactionStatusUpdate = asyncHandler(async (req, res) => {
  const { transactionId, status } = req.body;

  if (!transactionId) {
    return res.status(400).json({
      success: false,
      message: "Transaction Id is required",
    });
  }

  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    return res.status(404).json({
      success: false,
      message: "Transaction not found !",
    });
  }

  transaction.status = status;
  await transaction.save();

  return res.status(200).json({
    success: true,
    message: "Transaction Status Updated Successfully",
    data: transaction,
  });
});

export const getWallet = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userId is required",
    });
  }

  const wallet = await userModel
    .findById(userId)
    .select("totalBalance totalCommission withdrawalAmount profit investment");
  const transaction = await Transaction.find({userId})
    .sort({ createdAt: -1 })
    .limit(parseInt(10));
  wallet._doc.transaction = transaction;
  return res.status(200).json({
    success: true,
    message: "Wallet get successfully",
    data: wallet,
  });
});










