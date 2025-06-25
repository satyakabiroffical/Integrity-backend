import asyncHandler from "../../utils/asyncHandler.js";
import companyModel from "../../models/companyModel.js";


export const getOneCompany = asyncHandler(async(req,res)=>{
    const companyData = await companyModel.findOne();
    res.status(200).json({
        success:true,
        message:"Company data fetched successfully",
        data:companyData
    });

});

export const updateCompany = asyncHandler(async (req, res) => {
  const {
    companyId,
    name,
    phoneNumber,
    email,
    privacyPolicy,
    termsAndconditions,
    aboutUs,
  } = req.body;

 
  let logo, favIcon;
  if (req.files) {
    if (req.files.logo && req.files.logo.length > 0) {
      logo = req.files.logo[0].key;
    }
    if (req.files.favIcon && req.files.favIcon.length > 0) {
      favIcon = req.files.favIcon[0].key;
    }
  }

  const updatedData = {
    ...(name && { name }),
    ...(phoneNumber && { phoneNumber }),
    ...(email && { email }),
    ...(privacyPolicy && { privacyPolicy }),
    ...(termsAndconditions && { termsAndconditions }),
    ...(aboutUs && { aboutUs }),
    ...(logo && { logo }),
    ...(favIcon && { favIcon }),
  };

  const companyData = await companyModel.findByIdAndUpdate(companyId, updatedData, { new: true });
  if (!companyData) {
    return res.status(400).json({
      success: false,
      message: "Company data not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "Company data updated successfully",
    data: companyData,
  });
});