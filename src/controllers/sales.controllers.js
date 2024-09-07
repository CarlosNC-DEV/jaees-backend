import moment from 'moment';
import SaleSchema from "../models/sales.model.js";
import LotteriesSchema from "../models/lotteries.model.js";
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
    const timeZone = 'America/Santiago';
    const now = new Date(new Date().toLocaleString('en-US', { timeZone }));
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;

    // Obtén las loterías
    const lotteriesFound = await LotteriesSchema.find({
      name: { $in: req.body.games.map(game => game.loteria) },
      dayGames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'][now.getDay()],
    });

    // Verifica la hora de juego
    for (const lottery of lotteriesFound) {
      const hoursGame = parseFloat(lottery.hoursGame);

      if (now.getHours() >= hoursGame) {
        return responseError(res, 200, `Lotería ${lottery.name} cerrada`);
      }

      // Establece la fecha de juego para los juegos correspondientes
      req.body.games
        .filter(game => game.loteria === lottery.name)
        .forEach(game => {
          game.dateDayGame = currentDate;
        });
    }

    // Guarda la venta
    const saleModel = new SaleSchema(req.body);
    saleModel.codeSecure = await generateUniqueRandomCode(9);
    saleModel.code = await generateCode();

    await saleModel.save();

    responseSuccess(res, 200, "Venta registrada", saleModel._id);
  } catch (error) {
    console.log(error);
    responseError(res, 500, "Error");
  }
};


export const getAllSales = async (req, res) => {
  try {
    const allSales = await SaleSchema.find().populate({
      path: "idSaller",
      select: "-password",
    });

    const totalSize = allSales.length;
    const totalSales = allSales.reduce((total, venta) => total + sumarValueGames(venta),0);
    const subTotal = totalSales / 1.19
  
    const data = { totalSize, total:subTotal, totalIva:totalSales, sales:allSales}

    responseSuccess(res, 200, "ventas", data);

  } catch (error) {
    console.log(error)
    return responseError(res, 500, "Error");
  }
};

// Función auxiliar para redondear según la moneda
function roundCurrency(value, currency) {
  switch (currency) {
    case 'colombia':
      return `${Math.round(value)} COP`;
    case 'ecuador':
      return `${Number(value.toFixed(2))} USD`;
    case 'chile':
      return `${Math.round(value)} CLP`;
    default:
      return Number(value.toFixed(2));
  }
}

export const getSalesById = async (req, res) => {
  try {
    const saleById = await SaleSchema.findById(req.params.id).populate({
      path: "idSaller",
      select: "-password",
    });

    if (!saleById) {
      return responseError(res, 404, "Venta no encontrada");
    }

    let currency = 'colombia';
    if (saleById.idSaller.country) {
      currency = saleById.idSaller.country;
    }

    const totalGames = saleById.games.reduce((sum, game) => {
      const gameValue = Number(game.valueGame);
      return sum + (isNaN(gameValue) ? 0 : gameValue);
    }, 0);

    const subTotal = totalGames / 1.19;
    const ivaTotal = totalGames - subTotal;
    const totalPago = totalGames;

    const saleWithTotals = {
      ...saleById.toObject(),
      subTotal: roundCurrency(subTotal, currency),
      ivaTotal: roundCurrency(ivaTotal, currency),
      totalPago: roundCurrency(totalPago, currency)
    };

    responseSuccess(res, 200, "venta", saleWithTotals);
  } catch (error) {
    console.log(error);
    return responseError(res, 500, "Error al obtener la venta: " + error.message);
  }
};

export const getSalesByIdUser = async (req, res) => {
  try {
    const salesById = await SaleSchema.find({
      idSaller: req.params.id,
    });

    const totalSales = salesById.reduce((total, venta) => total + sumarValueGames(venta),0);

    const totalSizeGames = salesById.reduce((total, venta) => total + venta.games.length,0);

    const totalSalesIva = totalSales; 

    const totalComisonSales = totalSales * 0.02

    const data = { totalComisonSales, totalSalesIva, totalSizeGames};

    responseSuccess(res, 200, "ventas usuario", data);

  } catch (error) {
    console.log(error)
    return responseError(res, 500, "Error");
  }
};

export const getSalesByIdUserSales = async (req, res) => {
  try {
    const salesByIdUser = await SaleSchema.find({
      idSaller: req.params.idUser,
    }).sort({createDate:-1});

    responseSuccess(res, 200, "ventas usuario", salesByIdUser);

  } catch (error) {
    console.log(error)
    return responseError(res, 500, "Error");
  }
};


export const getSalesByDate = async (req, res) => {
  try {
    console.log(req.params.date, req.params.id)
    const salesById = await SaleSchema.find({
      createDate:req.params.date,
      idSaller:req.params.id
    });

    const totalSales = salesById.reduce(
      (total, venta) => total + sumarValueGames(venta),
      0
    );

    const totalSizeGames = salesById.reduce(
      (total, venta) => total + venta.games.length,
      0
    );

    const totalSalesIva = totalSales; 

    const totalComisonSales = totalSales * 0.02

    const data = [{ date:req.params.date, totalComisonSales, totalSalesIva, totalSizeGames}];

    responseSuccess(res, 200, "ventas usuario por fecha", data);

  } catch (error) {
    console.log(error)
    return responseError(res, 500, "Error");
  }
};

export const getSalesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate, id } = req.params;

    const salesByDateRange = await SaleSchema.find({
      createDate: { $gte: startDate, $lte: endDate },
      idSaller: id,
    });

    const result = salesByDateRange.reduce((acc, venta) => {
      const date = venta.createDate;

      if (!acc[date]) {
        acc[date] = {
          totalSales: 0,
          totalSizeGames: 0,
        };
      }

      acc[date].totalSales += sumarValueGames(venta);
      acc[date].totalSizeGames += venta.games.length;

      return acc;
    }, {});

    // Convertir el objeto resultante en un array de objetos
    const data = Object.keys(result).map((date) => ({
      date,
      totalComisonSales: result[date].totalSales * 0.02,
      totalSalesIva: result[date].totalSales,
      totalSizeGames: result[date].totalSizeGames,
    }));
    responseSuccess(res, 200, "ventas usuario por fecha", data);
  } catch (error) {
    console.log(error)
    return responseError(res, 500, "Error");
  }
};

const sumarValueGames = (venta) => {
  return venta.games.reduce((total, game) => parseFloat(total) + parseFloat(game.valueGame), 0);
};

