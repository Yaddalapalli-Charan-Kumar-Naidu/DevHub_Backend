import { Request } from "../models/requests.js";
import { User } from "../models/user.js";
import redis from "../utils/redisClient.js";

const SAFE_DATA = "firstName lastName photoURL age gender about skills";
export const getRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const cachedResponse=await redis.get(`connectionsReq:${userId}`);
    if(cachedResponse){
      return res.status(200).json({requests:JSON.parse(cachedResponse)});
    }
    const requests = await Request.find({
      toUserId: userId,
      status: "interested",
    }).populate("fromUserId", SAFE_DATA);
    redis.setex(`connectionsReq:${userId}`, 60, JSON.stringify(requests));
    res.status(200).json({ requests: requests });
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
};

export const getConnections = async (req, res) => {
  try {
    const userId = req.user.id;
    const cachedResponse=await redis.get(`connections:${userId}`);
    if(cachedResponse){
      return res.status(200).json({Connections:JSON.parse(cachedResponse)});
    }
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
    redis.setex(`connections:${userId}`,60,JSON.stringify(data));
    res.status(200).json({ Connections: data });
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
};


export const getFeed=async (req,res)=>{
    try{
    const userId=req.user.id;
    const cachedResponse=await redis.get(`feed:${userId}`);
    if(cachedResponse){
      return res.status(200).json({
        "feed":JSON.parse(cachedResponse)
      })
    }
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
    redis.setex(`feed:${userId}`,60,JSON.stringify(feed));
    res.status(200).json({
        "feed":feed
    })
}catch(err){
    res.status(500).json({"Error":err.message});
}
}