import SaleSchema from "../models/sales.model.js";
import {
  responseError,
  responseSuccess,
} from "../middlewares/responses.default.js";
import {
  generateCode,
  generateUniqueRandomCode,
} from "../middlewares/sales.random.js";

export const createSales = async (req, res) => {
  try {
    const saleModel = new SaleSchema(req.body);
    saleModel.codeSecure = await generateUniqueRandomCode(9);
    saleModel.code = await generateCode();

    saleModel.save();

    responseSuccess(res, 200, "venta registrada", saleModel._id);
  } catch (error) {
    console.log(error);
    return responseError(res, 500, "Error");
  }
};

export const getAllSales = async (req, res) => {
  try {

    const allSales = await SaleSchema.find().populate("idSaller");
    responseSuccess(res, 200, "ventas", allSales);
    
  } catch (error) {
    return responseError(res, 500, "Error");
  }
};

export const getSalesById = async (req, res) => {
  try {

    const saleById = await SaleSchema.findById(req.params.id).populate("idSaller");
    responseSuccess(res, 200, "venta", saleById);
    
  } catch (error) {
    return responseError(res, 500, "Error");
  }
};
