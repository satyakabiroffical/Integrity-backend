import ContactUs from "../../models/contactUsModel.js";

export const createContactUs = async(req,res)=>{
    const {firstName, lastName, phoneNumber, email, description} = req.body;
    try{
        if(!email && !phoneNumber){
            return res.status(400).json({
                success:false,
                message:"Email or Phone any one is required!"
            })
        }

        const data = await ContactUs.create({firstName, lastName, phoneNumber, email, description});
        return res.status(201).json({
            success:true,
            message:"Contact Us Created Successfully",
            data:data
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

