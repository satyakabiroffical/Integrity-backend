import mongoose from "mongoose";
import {createAdmin} from "../models/userModel.js";
import { defaultCreateCompany } from "../models/companyModel.js";
import { createDeafaultPlans } from "../models/planModel.js";
import { createDefaultDurations } from "../models/durationModel.js";
export const connectDB = async()=>{
    try{
     await mongoose.connect(process.env.DATABASE_URL)
     console.log("Database Connected Successfully");
     createAdmin();
     defaultCreateCompany();
     createDeafaultPlans();
     createDefaultDurations();
    }catch(error){
     console.log("Error in database connection")
    }
}



