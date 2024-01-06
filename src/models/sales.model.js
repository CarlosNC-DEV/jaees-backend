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
          type: String,
          required: true,
        },
        valueGame: {
          type: String,
          required: true,
        },
        numSerial: {
          type: String,
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
