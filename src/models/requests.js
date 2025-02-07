import mongoose from "mongoose";


const requestSchema=new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    status:{
        type:String,
        enum:['ignored','interested','rejected','accepted'],
        required:true
    }
},{
    timestamps:true
})

const Request=mongoose.model("Request",requestSchema);
export {Request};