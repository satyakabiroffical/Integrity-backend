import durationModel from "../../models/durationModel.js";

export const getDurationbyFilter = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    
    const filter = {};

    
    if (search) {
    
      const searchNum = Number(search);
      if (!isNaN(searchNum)) {
        filter.durationInMonths = searchNum;
      }
    }

  
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const durations = await durationModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await durationModel.countDocuments(filter);

    res.status(200).json({
      success: true,
      message:"Fetched Duration successfully",
      data:durations,
      total,
      page: pageNum,
      limit: limitNum,
    });
  } catch (error) {
  
    res.status(500).json({ success: false,error:error.message });
  }
};