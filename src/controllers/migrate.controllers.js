import LotteriesModel from "../models/lotteries.model.js";
import SalesModel from "../models/sales.model.js";
import UserModel from "../models/users.model.js";

import {
  responseError,
  responseSuccess,
} from "../middlewares/responses.default.js";

export const updateNewHorsh = async (req, res) => {
  try {
    const update = await LotteriesModel.updateMany(
      { hoursGame: { $exists: false } },
      { $set: { hoursGame: "22:30:30" } }
    );

    responseSuccess(res, 200, "loterias actualizadas");
  } catch (error) {
    return responseError(res, 500, "Error");
  }
};

export const updateNewTime = async (req, res) => {
  try {
    const update = await SalesModel.updateMany(
        { createTime: { $exists: false } },
        { $set: { createTime: "13:30:30" } }
    );

    responseSuccess(res, 200, "ventas actualizadas");
  } catch (error) {
    return responseError(res, 500, "Error");
  }
};

export const updateNewOline = async (req, res) => {
  try {
    const update = await UserModel.updateMany(
      { online: { $exists: false } },
      { $set: { online: false } }
    );

    responseSuccess(res, 200, "Usuarios actualizados");
  } catch (error) {
    return responseError(res, 500, "Error");
  }
};

export const updateSales = async (req, res) => {
  try {
    const documentsToUpdate = await SalesModel.find({
      $or: [
        { "games.numGame": { $type: 16 } },
        { "games.valueGame": { $type: 16 } },
        { "games.numSerial": { $type: 16 } },
        {
          games: {
            $elemMatch: {
              "numGame": { $type: 16 },
              "valueGame": { $type: 16 },
              "numSerial": { $type: 16 },
            },
          },
        },
      ],
    });

    // Convertir los valores de Number a String
    documentsToUpdate.forEach((doc) => {
      doc.games.forEach((game) => {
        if (typeof game.numGame === "number") {
          game.numGame = game.numGame.toString();
        }
        if (typeof game.valueGame === "number") {
          game.valueGame = game.valueGame.toString();
        }
        if (typeof game.numSerial === "number") {
          game.numSerial = game.numSerial.toString();
        }
      });
    });

    // Actualizar los documentos en la base de datos
    await Promise.all(
      documentsToUpdate.map(async (doc) => {
        await SalesModel.updateOne(
          { _id: doc._id },
          { $set: { games: doc.games } }
        );
      })
    );

    responseSuccess(res, 200, "Ventas actualizadas");
  } catch (error) {
    return responseError(res, 500, "Error");
  }
};






