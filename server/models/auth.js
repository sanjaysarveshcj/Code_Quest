import mongoose from "mongoose";
 const userschema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    points: { type: Number, default: 0 },
    about:{type:String},
    tags:{type:[String]},
    joinedon:{type:Date,default:Date.now},
    phone: {type: String,unique: true,sparse: true},
    resetPasswordRequestTime: { type: Date, default: null }
 })

 export default mongoose.model("User",userschema)