import cityModel from "../../models/cityModel.js";

export const createCity = async (req, res) => {
  const { name } = req.body;
  try {
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "City Name is required",
      });
    }
    const data = await cityModel.create({ name });
    return res.status(201).json({
      success: true,
      message: "City Created Successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCity = async (req, res) => {
  const { cityId, name, disable } = req.body;
  try {
    if (!cityId) {
      return res.status(400).json({
        success: false,
        message: "cityId is required",
      });
    }
    const data = await cityModel.findById(cityId);
    data.name = name ? name : data.name;
    data.disable = disable ? disable : data.disable;

    return res.status(201).json({
      success: true,
      message: "City Updated Successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCityById = async (req, res) => {
  const { cityId } = req.query;
  try {
    if (!cityId) {
      return res.status(400).json({
        success: false,
        message: "city id is required",
      });
    }
    const city = await cityModel.findById(cityId);
    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "City Fetched Successfully",
      data: city,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllCity = async (req, res) => {
  const { page = 1, limit = 20, sort = -1 } = req.query;
  const skip = (page - 1) * limit;
  try {
    const data = await cityModel
      .find()
      .sort({ createdAt: parseInt(sort) })
      .skip(skip)
      .limit(limit);
    const total = await cityModel.countDocuments();

    return res.status(200).json({
      success: true,
      message: "Fetched All City Successfully",
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

export const deleteCityById = async (req, res) => {
  const { cityId } = req.query;
  try {
    if (!cityId) {
      return res.status(400).json({
        success: false,
        message: "city id is required",
      });
    }
    const city = await cityModel.findByIdAndDelete(cityId);

    return res.status(200).json({
      success: true,
      message: "City Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
