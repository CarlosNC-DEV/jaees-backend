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

export const getAllLottieresHabilitadas = async (req, res) => {
  try {

    const allLottieres = await LotteriesModel.find({state:true});

    return responseSuccess(res, 200, "loterias", allLottieres);

  } catch (error) {
    return responseError(res, 500, "error");
  }
};

export const updateAmountMax = async(req, res)=>{
  try {

    const lotteriesUpdate = await LotteriesModel.findByIdAndUpdate(req.params.id, 
    { amountMax: req.body.amountMax, state:req.body.state, name:req.body.name});
    
    if(!lotteriesUpdate){
      return responseError(res, 200, "No fue posible actualizar la loteria");
    }

    
    return responseSuccess(res, 200, "loteria actualizada");

  } catch (error) {
    return responseError(res, 500, "error");
  }
}
