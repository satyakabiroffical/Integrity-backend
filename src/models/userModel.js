import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    // Agent/TL
    name: {
      type: String,
      trim: true,
    },
    mobile: {
      type: Number,
    },
    alternativeNumber: {
      type: Number,
    },
    email: {
      type: String,
      trim: true,
    },
    userImage: {
      type: String,
      trim: true,
      default:null

    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
    },
    fullAddress: {
      type: String,
      trim: true,
    },
    adharNumber: {
      type: String,
      trim: true,
    },
    adharFrontImage: {
      type: String,
      trim: true,
    },
    adharBackImage: {
      type: String,
      trim: true,
    },
    panCardNumber: {
      type: String,
      trim: true,
    },
    panFrontImage: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    otp: {
      type: String,
    },
    userType: {
      type: String,
      enum: ["USER", "ADMIN", "TEAM_LEADER", "AGENT"],
      default: "USER",
    },
    termsAndCondition: {
      type: Boolean,
      default: false,
    },
    // for user additional field
    nomineeName: {
      type: String,
      trim: true,
    },
    haveYouBusiness: {
      type: Boolean,
      default: false,
    },
    business: {
      businessName: String,
      businessImage: String,
      businessAddress: String,
    },
    userVerified: {
      type: Boolean,
      default: false,
    },

    // wallet details
    totalBalance: {
      type: Number,
      default: 0,
    },
    totalCommission: {
      type: Number,
      default: 0,
    },

    withdrawalAmount: {
      type: Number,
      default: 0,
    },
    profit: {
      type: Number,
      default: 0,
    },
    investment: {
      type: Number,
      default: 0,
    },

    // for all
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
    },

    // added new

    profit: {
      type: Number,
      default: 0,
    },

    // added again
    totalPackage:{
      type:Number,
      default:0
    },

    activePackage:{
      type:Number,
      default:0
    }
  },
  { timestamps: true }
);

const userModel = mongoose.model("userModel", userSchema);
export default userModel;

// default function of admin creation
const createAdmin = async () => {
  try {
    const count = await userModel.findOne({ userType: "ADMIN" });
    if (!count) {
      await userModel.create({
        userType: "ADMIN",
        email: "admin@gmail.com",
        password: await bcrypt.hash("Admin@123", 10),
      });
      console.log("Admin Created Successfully");
    } else {
      console.log("Admin Already Exist");
    }
  } catch (error) {
    console.log("Error in Admin Creation");
  }
};

export { createAdmin };
