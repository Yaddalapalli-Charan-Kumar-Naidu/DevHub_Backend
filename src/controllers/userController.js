import { Request } from "../models/requests.js";
import { User } from "../models/user.js";

const SAFE_DATA = "firstName lastName photoURL age gender about skills";
export const getRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await Request.find({
      toUserId: userId,
      status: "interested",
    }).populate("fromUserId", SAFE_DATA);
    res.status(200).json({ requests: requests });
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
};

export const getConnections = async (req, res) => {
  try {
    const userId = req.user.id;
    const connections = await Request.find({
      $or: [
        { fromUserId: userId, status: "accepted" },
        { toUserId: userId, status: "accepted" },
      ],
    })
      .populate("fromUserId", SAFE_DATA)
      .populate("toUserId", SAFE_DATA);
    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === userId.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.status(200).json({ Connections: data });
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
};


export const getFeed=async (req,res)=>{
    try{
    const userId=req.user.id;
    
    const connections=await Request.find({
        $or:[
            {fromUserId:userId},
            {toUserId:userId}
        ]
    }).select("fromUserId toUserId");
    const hideUsers=new Set();
    connections.forEach((req)=>{
        hideUsers.add(req.fromUserId);
        hideUsers.add(req.toUserId);
    })
    const feed=await User.find({
        $and:[
            {_id:{ $nin: Array.from(hideUsers) }},
            {_id:{ $ne:userId }}
        ]
    }).select(SAFE_DATA);
    res.status(200).json({
        "feed":feed
    })
}catch(err){
    res.status(500).json({"Error":err.message});
}
}