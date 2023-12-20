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
    const allSales = await SaleSchema.find().populate({
      path: "idSaller",
      select: "-password",
    });
    responseSuccess(res, 200, "ventas", allSales);
  } catch (error) {
    return responseError(res, 500, "Error");
  }
};

export const getSalesById = async (req, res) => {
  try {
    const saleById = await SaleSchema.findById(req.params.id).populate({
      path: "idSaller",
      select: "-password",
    });
    responseSuccess(res, 200, "venta", saleById);
  } catch (error) {
    return responseError(res, 500, "Error");
  }
};

export const getSalesByIdUser = async (req, res) => {
  try {
    const salesById = await SaleSchema.find({
      idSaller: req.params.id,
    });

    const totalSales = salesById.reduce(
      (total, venta) => total + sumarValueGames(venta),
      0
    );

    const totalSizeGames = salesById.reduce(
      (total, venta) => total + venta.games.length,
      0
    );

    const totalSalesIva = totalSales * 1.19; 

    const data = { totalSales, totalSalesIva, totalSizeGames};

    responseSuccess(res, 200, "ventas usuario", data);

  } catch (error) {
    console.log(error)
    return responseError(res, 500, "Error");
  }
};

const sumarValueGames = (venta) => {
  return venta.games.reduce((total, game) => total + game.valueGame, 0);
};
