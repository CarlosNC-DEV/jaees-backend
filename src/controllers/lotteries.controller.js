import LotteriesModel from "../models/lotteries.model.js";
import {
  responseError,
  responseSuccess,
} from "../middlewares/responses.default.js";

export const createLottieres = async (req, res) => {
  try {
    
    const lotteriesFound = await LotteriesModel.findOne({
      name: req.body.name,
    });
    if (lotteriesFound) {
      return responseError(res, 200, "loteria en uso");
    }

    const lotteriesModel = new LotteriesModel(req.body);
    await lotteriesModel.save();

    return responseSuccess(res, 200, "loteria creada exitosamente");

  } catch (error) {
    return responseError(res, 500, "error");
  }
};

export const getAllLottieres = async (req, res) => {
  try {

    const allLottieres = await LotteriesModel.find();

    return responseSuccess(res, 200, "loterias", allLottieres);

  } catch (error) {
    return responseError(res, 500, "error");
  }
};
