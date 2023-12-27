import { Schema, model } from "mongoose";

const companySchema = new Schema(
  {
    nit: {
      type: String,
      required:true
    },
    register:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

export default model("company", companySchema);
