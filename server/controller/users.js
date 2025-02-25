import mongoose from "mongoose"
import users from '../models/auth.js'

export const getallusers = async (req, res) => {
    try {
        const allusers = await users.find()
        const alluserdetails = [];
        allusers.forEach((user) => {
            alluserdetails.push({_id:user._id,
                name:user.name,
                about:user.about,
                tags:user.tags,
                joinedon:user.joinedon,
            });     
        });
        res.status(200).json(alluserdetails)
    } catch (error) {
        res.status(404).json({message:error.message})
        return
    }
}
export const updateprofile=async(req,res)=>{
    const{id:_id}=req.params;
    const {name,about,tags}=req.body;
    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send("user unavailable");
    }
    try {
        const updateprofile=await users.findByIdAndUpdate(_id,{$set:{name:name,about:about,tags:tags}},
            {new:true}
        );
        res.status(200).json(updateprofile)
    } catch (error) {
        res.status(404).json({message:error.message})
        return
    }
}


export const searchUser = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required for search." });
    }

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error searching for user.", error });
  }
};

export const transferPoints = async (req, res) => {
  try {
    const { senderId, receiverEmail, points } = req.body;

    if (!senderId || !receiverEmail || !points) {
      console.log("Missing Fields:", { senderId, receiverEmail, points });
      return res.status(400).json({ message: "All fields are required." });
    }

    const sender = await users.findOne({ email: senderId });
    const receiver = await users.findOne({ email: receiverEmail });

    if (!sender || !receiver) {
      return res.status(404).json({ message: "Sender or Receiver not found." });
    }

    if (sender.points < points) {
      return res.status(400).json({ message: "Sender does not have enough points." });
    }

    if (points <= 0) {
      return res.status(400).json({ message: "Points to transfer must be greater than zero." });
    }
    

    sender.points -= points;
    receiver.points += points;

    await sender.save();
    await receiver.save();

    res.status(200).json({ message: "Points transferred successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error transferring points.", error });
    console.log(error);
  }
};