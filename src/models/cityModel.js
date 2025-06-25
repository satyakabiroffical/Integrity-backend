import mongoose from "mongoose";

const citySchema = mongoose.Schema({
    name:{
        type:String,
        trim:true
    },
    disable:{
        type:Boolean,
        default:false
    }
})

export default mongoose.model("City", citySchema);