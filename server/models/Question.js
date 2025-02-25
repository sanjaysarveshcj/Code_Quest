import mongoose from "mongoose"

const Questionschema=mongoose.Schema({
    questiontitle:{type:String,required:"Question must have a title"},
    questionbody:{type:String,required:"Question must have a body"},
    questiontags:{type:[String],required:"Question must have a tags"},
    video: { type: String, default: null },
    noofanswers:{type:Number,default:0},
    upvote:{type:[String],default:[]},
    downvote:{type:[String],default:[]},
    userposted:{type:String,required:"Question must have an author"},
    userid:{type:String},
    askedon:{type:Date,default:Date.now},
    answer:[
        {
            answerbody:String,
            useranswered:String,
            userid:String,
            answeredon:{type:Date,default:Date.now},
            upvote: { type: [String], default: [] },
            downvote: { type: [String], default: [] },
            upvoteMilestone: { type: Number, default: 0 },
            downvoteMilestone: { type: Number, default: 0 },
        },
    ],
});
export default mongoose.model("Question",Questionschema)