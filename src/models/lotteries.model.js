import { Schema, model } from "mongoose";

const lotteriesSchema = new Schema(
  {
    name: { type: String, required: true },
    dayGames: [ String ],
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

export default model("lotteries", lotteriesSchema);
