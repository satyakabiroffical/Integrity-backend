import planModel from "../../models/planModel.js";

export const getPlan = async (req, res) => {
  try {
    const planData = await planModel.find();
    return res.status(200).json({
      success: true,
      message: "Fectched plans successfully",
      data: planData,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createPlan = async (req, res) => {
  const { title, description, minAmount, returnRate ,maxAmount} = req.body;
  const image = req.file? req.file.location:null;
  try {
    if (!title || !description || !minAmount || !returnRate) {
      return res.status(400).json({
        success: false,
        message: "All field are required !",
      });
    }

    const data = await planModel.create({
      title,
      description,
      minAmount,
      returnRate,
      image,
      maxAmount
    });
    return res.status(200).json({
      success: true,
      message: "Plan Created Successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPlanById = async (req, res) => {
  const { planId } = req.query;
  try {
    if (!planId) {
      return res.status(400).json({
        success: false,
        message: "Plan Id is required !",
      });
    }

    const planData = await planModel.findById(planId).populate("durationId", "durationInMonths");

    if (!planData) {
      return res.status(404).json({
        success: false,
        message: "Plan Not Found !",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fectched Single Plan Successfully",
      data: planData,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
