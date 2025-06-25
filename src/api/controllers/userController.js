import userModel from "../../models/userModel.js";
import asyncHandler from "../../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { deleteFileMulter } from "../middlewares/multer.js";
import Purchase from "../../models/purchaseModel.js";
import mongoose from "mongoose";


export const createUserByRole = async (req, res) => {
  const {
    name,
    mobile,
    alternativeNumber,
    email,
    cityId,
    fullAddress,
    password,
    confirmPassword,
    termsAndCondition,
    nomineeName,
    haveYouBusiness,
    businessName,
    businessAddress,
    createdBy,
  } = req.body;

  const { role } = req.query; // role = "TEAM_LEADER" | "AGENT" | "USER"
  const otp = "1234";

  try {
    const exist = await userModel.findOne({ mobile });
    if (exist) {
      return res.status(409).json({
        success: false,
        message: "User Already Exist.",
      });
    }
    // Validate confirm password
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Confirm password does not match",
      });
    }

    // Validate creator's role
    const creator = await userModel.findById(createdBy);
    if (
      (role === "TEAM_LEADER" && creator?.userType !== "ADMIN") ||
      (role === "AGENT" && creator?.userType !== "TEAM_LEADER") ||
      (role === "USER" && creator?.userType !== "AGENT")
    ) {
      return res.status(403).json({
        success: false,
        message: `You are not authorized to create a ${role.toLowerCase()}`,
      });
    }

    // Additional check for USER role if they claim to have a business
    if (
      role === "USER" &&
      haveYouBusiness &&
      (!businessName || !businessAddress)
    ) {
      return res.status(400).json({
        success: false,
        message: "Business name and address are required",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const hashOtp = await bcrypt.hash(otp, 10);

    // Handle image files
    const userImage =
      req.file?.key || req.files?.userImage?.[0]?.key || undefined;
    const businessImage = req.files?.businessImage?.[0]?.key || undefined;

    const newUser = await userModel.create({
      name,
      mobile,
      alternativeNumber,
      email,
      cityId,
      fullAddress,
      password: hashPassword,
      otp: hashOtp,
      userType: role,
      userImage,
      termsAndCondition,
      nomineeName: role === "USER" ? nomineeName : undefined,
      haveYouBusiness: role === "USER" ? haveYouBusiness : false,
      business:
        role === "USER" && haveYouBusiness
          ? {
              businessName,
              businessImage,
              businessAddress,
            }
          : undefined,

      createdBy,
    });

    return res.status(201).json({
      success: true,
      otp: `Your otp is - ${otp}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const signIn = asyncHandler(async (req, res) => {
  const { mobile, password } = req.body;
  const exstingUser = await userModel.findOne({ mobile });

  if (!exstingUser) {
    return res.status(404).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  //  const hashPassword = await compareValue(password, exstingUser?.password);
  const isPassword = await bcrypt.compare(password, exstingUser?.password);
  if (isPassword == false) {
    return res.status(400).json({
      success: false,
      message: "Invalid password",
    });
  }

  const token = jwt.sign({ id: exstingUser._id }, process.env.JWT_SECRET, {
    expiresIn: "16d",
  });

  exstingUser._doc.token = token;

  res.status(200).json({
    message: "User signed in successfully",
    success: true,
    data: exstingUser,
  });
});

export const forgetPassword = asyncHandler(async (req, res) => {
  const { mobile } = req.body;
  const existingUser = await userModel.findOne({ mobile });
  if (!existingUser) {
    return res.status(404).json({
      success: false,
      message: "User not found !",
    });
  }

  const otp = "1234";
  const hashOtp = await bcrypt.hash(otp.toString(), 10);

  existingUser.otp = hashOtp;
  await existingUser.save();

  return res.status(200).json({
    success: true,
    otp: `Your OTP is - ${otp} `,
  });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { mobile, otp } = req.body;

  const existingUser = await userModel.findOne({ mobile });
  if (!existingUser) {
    return res.status(404).json({
      success: false,
      message: "User not found !",
    });
  }

  const isMatch = await bcrypt.compare(otp.toString(), existingUser?.otp);

  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  res.status(200).json({
    success: true,
    message: "OTP verified successfully",
    data: existingUser,
  });
});

export const forgetChangedPassaword = asyncHandler(async (req, res) => {
  const { userId, confirmPassword, newPassword } = req.body;

  const user = await userModel.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  if (confirmPassword != newPassword) {
    return res.status(400).json({
      success: false,
      message: "Confirm and New Password are not matched !",
    });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

// user profile update section
export const updateProfile = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const { name, mobile, alternativeNumber, email, fullAddress } = req.body;
  const updatedData = { name, mobile, alternativeNumber, email, fullAddress };

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userId is required.",
    });
  }
  const user = await userModel.findById(userId);
  if (req.file && user?.userImage) {
    deleteFileMulter(user?.userImage);
  }
  const userImage = req.file ? req.file.key : user.userImage;
  updatedData.userImage = userImage;

  const data = await userModel.findByIdAndUpdate(userId, updatedData, {
    new: true,
  });
  return res.status(200).json({
    success: true,
    message: "Profile Updated successfully",
    data: data,
  });
});

// user change password
export const updatePassword = asyncHandler(async (req, res) => {
  const { userId, oldPassword, newPassword, confirmPassword } = req.body;
  if (!userId || !oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message:
        "All fields userId, oldPassword, newPassword and confirmPassword are required",
    });
  }

  const user = await userModel.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Invalid Credential !!",
    });
  }

  const isMatchOld = await bcrypt.compare(oldPassword, user.password);
  if (isMatchOld == false) {
    return res.status(400).json({
      success: false,
      message: "Entered Wrong Password !",
    });
  }

  if (newPassword != confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "New Password is not same Confirm Password !",
    });
  }

  const hashPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashPassword;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password updated successfully",
    data: user,
  });
});

// filter - All Agent or user

export const filterAllAgentOrUser = asyncHandler(async (req, res) => {
  const { userId, userType, search, page = 1, limit = 20, sort = -1 } = req.query;
  const skip = (page - 1) * limit;

  const orFilters = [
    { name: new RegExp(search, "i") },
    { email: new RegExp(search, "i") },
  ];

  if (!isNaN(search)) {
    orFilters.push({ mobile: search });
    orFilters.push({ alternativeNumber: search });
  }

  if (mongoose.Types.ObjectId.isValid(search)) {
    orFilters.push({ _id: new mongoose.Types.ObjectId(search) });
  }

  let data, total;

  // Case 1: Team Leader wants users created by their agents
  if (userId && userType === "USER") {
    // Step 1: Get all agents created by the team leader
    const agents = await userModel.find({ createdBy: userId, userType: "AGENT" });

    const agentIds = agents.map(agent => agent._id);

    // Step 2: Get all users created by those agents
    const filter = {
      createdBy: { $in: agentIds },
      userType: "USER",
      ...(search && { $or: orFilters }),
    };

    data = await userModel
      .find(filter)
      .sort({ createdAt: parseInt(sort) })
      .skip(skip)
      .limit(limit);

    total = await userModel.countDocuments(filter);
  }

  // Case 2: Default filtering logic
  else {
    const filter = {
      ...(userType && { userType }),
      ...(search && { $or: orFilters }),
      ...(userId && { createdBy: userId }),
    };

    data = await userModel
      .find(filter)
      .populate("cityId", "name")
      .sort({ createdAt: parseInt(sort) })
      .skip(skip)
      .limit(limit);

    total = await userModel.countDocuments(filter);
  }

  return res.status(200).json({
    success: true,
    message: "Data List Fetched Successfully",
    data: data,
    currentPage: page,
    page: Math.ceil(total / limit),
  });
});


// get Team Ledaer and Agent Profile and user profile
export const getProfile = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required",
    });
  }

  const user = await userModel.findById(userId).populate("createdBy");
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const totalCreated = await userModel.countDocuments({ createdBy: userId });
  const livePlan = await Purchase.find({ userId, active: true }).populate("planId", "image");
  const maturePlan = await Purchase.find({ userId, active: false }).populate("planId", "image");

  if (user.userType === "TEAM_LEADER") {
    const agents = await userModel.find({ createdBy: userId });
    const agentIds = agents.map((agent) => agent._id);

    const agentTotalPackage = agents?.reduce((acc, cur) => {
      return acc + (cur.totalPackage || 0);
    }, 0);

    const agentTotalActivePackage = agents?.reduce((acc, cur) => {
      return acc + (cur.totalPackage || 0);
    }, 0);

    const agentTotalUsers = await userModel.find({
      createdBy: { $in: agentIds },
    });

    const totalUserPackage = agentTotalUsers?.reduce((acc, cur) => {
      return acc + (cur.totalPackage || 0);
    }, 0);

    const totalUserActivePackage = agentTotalUsers?.reduce((acc, cur) => {
      return acc + (cur.activePackage || 0);
    }, 0);

    const totalUser = await userModel.countDocuments({
      createdBy: { $in: agentIds },
    });

    user._doc.totalAgent = totalCreated;
    user._doc.totalUser = totalUser;
    user._doc.AllPackage =
      user.totalPackage + agentTotalPackage + totalUserPackage;
    user._doc.AllActivePackage =
      user.activePackage + agentTotalActivePackage + totalUserActivePackage;
  } else if (user.userType === "AGENT") {
    const allUser = await userModel.find({ createdBy: userId });


    const totalUserPackage = allUser?.reduce((acc, cur) => {
  return acc + (cur.totalPackage || 0);
}, 0); 



    const totalUserActivePackage = allUser?.reduce((acc, cur) => {
  return acc + (cur.activePackage || 0);
}, 0);

    user._doc.totalUser = totalCreated;
	 user._doc.collections = 0;
    user._doc.AllPackage = user.totalPackage + totalUserPackage;
    user._doc.AllActivePackage = user.activePackage + totalUserActivePackage;
  }

  user._doc.livePlan = livePlan;
  user._doc.maturePlan = maturePlan;

  return res.status(200).json({
    success: true,
    message: "User Profile Fetched Successfully",
    data: user,
  });
});
// get team leader or agent dashboard
export const getDashBoard = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required",
    });
  }

  const user = await userModel.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const totalCreated = await userModel.countDocuments({ createdBy: userId });
  const totalPackage = await Purchase.countDocuments({ userId });
  const totalActivePackage = await Purchase.countDocuments({
    userId,
    active: true,
  });
  const investment = await Purchase.find({ userId });
  const totalInvestment = investment.reduce((acc, cur) => {
    return acc + cur.totalPay;
  }, 0);
  const profit = await Purchase.find({ userId });
  const totalProfit = profit.reduce((acc, cur) => {
    return acc + cur.maturityReturnAmount;
  }, 0);

  const finalProfit = totalInvestment - totalProfit;

  if (user.userType === "TEAM_LEADER") {
    const agents = await userModel.find({ createdBy: userId });
    const agentIds = agents.map((agent) => agent._id);

    const totalUser = await userModel.countDocuments({
      createdBy: { $in: agentIds },
    });

    user._doc.totalAgent = totalCreated;
    user._doc.totalUser = totalUser;
    user._doc.totalPackage = totalPackage;
    user._doc.totalActivePackage = totalActivePackage;
  } else if (user.userType === "AGENT") {
    user._doc.totalUser = totalCreated;
    user._doc.totalPackage = totalPackage;
    user._doc.totalActivePackage = totalActivePackage;
  }

  user._doc.investment = totalInvestment;
  user._doc.profit = finalProfit;

  return res.status(200).json({
    success: true,
    message: "User Profile Fetched Successfully",
    data: user,
  });
});
