import { Schema, model } from "mongoose";

const salesSchema = new Schema(
  {
    code: {
      type: Number,
      required: true,
      unique: true,
    },
    codeSecure: {
      type: Number,
      required: true,
      unique: true,
    },
    idSaller:{
      ref:"users",
      type:Schema.Types.ObjectId,
      required:true
    },
    games: [
      {
        _id:false,
        loteria: {
          type: String,
          required: true,
        },
        numGame: {
          type: Number,
          required: true,
        },
        valueGame: {
          type: Number,
          required: true,
        },
        numSerial: {
          type: Number,
          required: false,
          default: null,
        },
        dateDayGame:{
          type:String,
          required:false,
          default:null
        }
      }
    ],
    createDate:{
      type:String,
      required:true
    }
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

export default model("Sales", salesSchema);
