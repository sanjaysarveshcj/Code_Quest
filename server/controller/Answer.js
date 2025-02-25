import mongoose from "mongoose";
import Question from "../models/Question.js";
import User from "../models/auth.js";

export const postanswer = async (req, res) => {
  const { id: _id } = req.params;
  const { noofanswers, answerbody, useranswered } = req.body;
  const userid = req.userid;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("Question unavailable...");
  }

  updatenoofquestion(_id, noofanswers);

  try {
    const updatequestion = await Question.findByIdAndUpdate(
      _id,
      { $addToSet: { answer: [{ answerbody, useranswered, userid }] } },
      { new: true }
    );

    await User.findByIdAndUpdate(userid, { $inc: { points: 5 } });

    res.status(200).json(updatequestion);
  } catch (error) {
    res.status(500).json({ message: "Error in uploading answer." });
  }
};

const updatenoofquestion = async (_id, noofanswers) => {
  try {
    await Question.findByIdAndUpdate(_id, { $set: { noofanswers } });
  } catch (error) {
    console.error("Error in updating number of answers:", error);
  }
};

export const deleteanswer = async (req, res) => {
  const { id: _id } = req.params;
  const { answerid, noofanswers } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("Question unavailable...");
  }
  if (!mongoose.Types.ObjectId.isValid(answerid)) {
    return res.status(404).send("Answer unavailable...");
  }

  updatenoofquestion(_id, noofanswers);

  try {
    const question = await Question.findById(_id);
    const answer = question.answer.find((ans) => ans._id.toString() === answerid);

    if (answer) {
      await User.findByIdAndUpdate(answer.userid, { $inc: { points: -5 } });
    }

    await Question.updateOne(
      { _id },
      { $pull: { answer: { _id: answerid } } }
    );

    res.status(200).json({ message: "Answer deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error in deleting answer." });
  }
};

export const voteAnswer = async (req, res) => {
  const { id:_id } = req.params;
  const { answerid, value } = req.body;
  const userid = req.userid;

  if (
    !mongoose.Types.ObjectId.isValid(_id) ||
    !mongoose.Types.ObjectId.isValid(answerid)
  ) {
    return res.status(404).send("Invalid question or answer ID.");
  }

  try {
    const question = await Question.findById(_id);
    if (!question) return res.status(404).send("Question not found.");

    const answer = question.answer.find((ans) => ans._id.toString() === answerid);
    if (!answer) return res.status(404).send("Answer not found.");

    const upIndex = answer.upvote.findIndex((id) => id === String(userid));
    const downIndex = answer.downvote.findIndex((id) => id === String(userid));

    if (value === "upvote") {
      if (downIndex !== -1) {
        answer.downvote = answer.downvote.filter((id) => id !== String(userid));
      }
      if (upIndex === -1) {
        answer.upvote.push(userid);
      } else {
        answer.upvote = answer.upvote.filter((id) => id !== String(userid));
      }

      if (answer.upvote.length % 5 === 0 && answer.upvote.length > answer.upvoteMilestone * 5) {
        await User.findByIdAndUpdate(answer.userid, { $inc: { points: 5 } });
        answer.upvoteMilestone += 1;
      }

    } else if (value === "downvote") {
      if (upIndex !== -1) {
        answer.upvote = answer.upvote.filter((id) => id !== String(userid));
      }
      if (downIndex === -1) {
        answer.downvote.push(userid);
      } else {
        answer.downvote = answer.downvote.filter((id) => id !== String(userid));
      }

      if (answer.downvote.length % 5 === 0 && answer.downvote.length > answer.downvoteMilestone * 5) {
        await User.findByIdAndUpdate(answer.userid, { $inc: { points: -5 } });
        answer.downvoteMilestone += 1;
      }

    }

    await question.save();


    res.status(200).json({ message: "Voted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error in voting.", error });
  }
};



