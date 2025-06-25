import mongoose from "mongoose";

const durationSchema = new mongoose.Schema({
 
   durationInMonths: {
    type: Number,
    enum: [12, 18, 36, 60],
  },


},{timestamps:true});

const Duration = mongoose.model("Duration",durationSchema);

export default Duration;

const createDefaultDurations = async () => {
  const durationsData = [
    {_id:"68303e8fa6483bde3f8941e0", durationInMonths: 12 },
    {_id:"683042bd50c9acce1fc06785", durationInMonths: 18 },
    {_id:"683043dd50c9acce1fc0678a", durationInMonths: 36 },
    {_id:"68304a2e50c9acce1fc06791", durationInMonths: 60 },
  ];

  const existingDurations = await Duration.countDocuments();

  if (!existingDurations) {
    await Duration.insertMany(durationsData);
    console.log("Default durations created successfully");
  } else {
    console.log("Default durations already exist");
  }
}

export { createDefaultDurations };