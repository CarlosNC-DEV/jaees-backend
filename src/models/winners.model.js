import { Schema, model } from "mongoose";

const winnersSchema = new Schema(
  {
    numGame:{
        type:String
    },
    lottery:{
        ref: "lotteries",
        type: Schema.Types.ObjectId,
    },
    dateGame: {
        type: String
    },
    winners:[
        {
          ref: "Sales",
          type: Schema.Types.ObjectId,
        },
    ]
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

export default model("winners", winnersSchema);
