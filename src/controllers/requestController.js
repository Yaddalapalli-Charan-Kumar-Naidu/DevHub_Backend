import { Request } from "../models/requests.js";
import { User } from "../models/user.js";
import mongoose from "mongoose";
export const sendRequest = async (req, res) => {
  try {
    const { status, userId } = req.params;
    const allowedStatus = ["ignored", "interested"];

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid user ID format" });
    }
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ error: "Invalid API request" });
    }

    if (String(userId) === String(req.user.id)) {
      return res.status(400).json({ error: "Cannot send request to yourself" });
    }

    const toUser = await User.findById(userId);
    if (!toUser) {
      return res.status(404).json({ error: "User doesn't exist" });
    }

    const alreadyPresent = await Request.exists({
      $or: [
        { fromUserId: req.user.id, toUserId: userId },
        { fromUserId: userId, toUserId: req.user.id },
      ],
    });

    if (alreadyPresent) {
      return res.status(400).json({
        error: `A request between you and ${toUser.firstName} already exists.`,
      });
    }

    const newRequest = new Request({
      fromUserId: req.user.id,
      toUserId: userId,
      status: status,
    });

    await newRequest.save();

    const populatedRequest = await Request.findById(newRequest._id)
      .populate("fromUserId", "firstName lastName")
      .populate("toUserId", "firstName lastName");

    res.status(200).json({ msg: "Request sent", request: populatedRequest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const reviewRequest = async (req, res) => {
  try {
    const { status, requestId } = req.params;
    const allowedStatus = ["accepted", "rejected"];
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({ error: "Invalid request ID format" });
    }
    if (!allowedStatus.includes(status)) {
      return res.status(404).json({ Error: "Invalid api" });
    }
    const request = await Request.findOne({
      _id: requestId,
      toUserId: req.user.id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName");
    if (!request) {
      return res.status(404).json({ Error: "No requests available" });
    }
    // if(request.toUserId.toString()!==req.user.id.toString()){
    //     return res.status(404).json({"Error":"Unauthorized request access"});
    // }
    request.status = status;
    await request.save();
    res
      .status(200)
      .json({
        msg: `you ${request.status} request from ${request.fromUserId.firstName}`,
      });
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
};
