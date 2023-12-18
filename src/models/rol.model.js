import { Schema, model } from "mongoose";

const rolSchema = new Schema(
  {
    name: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

export default model("roles", rolSchema);
