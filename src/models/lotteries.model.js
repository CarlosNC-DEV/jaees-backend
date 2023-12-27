import { Schema, model } from "mongoose";

const lotteriesSchema = new Schema(
  {
    name: { type: String, required: true },
    dayGames: [ String ],
    amountMax: { type:Number, required:true},
    state:{ type:Boolean, required:false, default:true }
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

export default model("lotteries", lotteriesSchema);
