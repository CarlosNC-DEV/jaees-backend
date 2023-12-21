import { Schema, model } from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    indentification: {
      type: Number,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    rol: [
      {
        ref: "roles",
        type: Schema.Types.ObjectId,
      },
    ],
    createDate:{
      type:String,
      required:true
    }
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

userSchema.methods.hassPassword = async (password) => {
  return bcryptjs.hash(password, 10);
};

userSchema.statics.validatePassword = async (password, newPassword) => {
  return bcryptjs.compare(password, newPassword);
};

export default model("users", userSchema);
