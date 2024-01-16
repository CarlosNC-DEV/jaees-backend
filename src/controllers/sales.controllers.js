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
    const saleModel = new SaleSchema(req.body);
    const lotteriesFound = await LotteriesSchema.find({ name: { $in: saleModel.games.map(game => game.loteria) } });

    let responseSent = false;

    for (const lottery of lotteriesFound) {
      const days = lottery.dayGames;
      const hoursGame = lottery.hoursGame;

      const timeZone = 'America/Santiago';
      const now = new Date(new Date().toLocaleString('en-US', { timeZone }));
      const hours = now.getHours();
      const today = now.getDay()

      let closestDayIndex = days.findIndex(day => {
      const dayIndex = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'].indexOf(day.toLowerCase());
        if (dayIndex === today) {
          if (hours >= parseFloat(hoursGame)) {
              responseSent = true;
              responseError(res, 200, `Loteria ${lottery.name} cerrada`);
          } else {
            return true;
          }
        }

        /*

        if (days.length === 1) {
          responseSent = true;
          responseError(res, 200, `Loteria ${lottery.name} cerrada`);
        } else {
          return false;
        }

        */

        return dayIndex >= 0 && dayIndex > today
      });

      if (responseSent) {
        break; 
      }

      if (closestDayIndex < 0 || closestDayIndex >= days.length || ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes','sábado'].indexOf(days[closestDayIndex].toLowerCase()) < today) {
        closestDayIndex = days.findIndex(day => {
          const dayIndex = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'].indexOf(day.toLowerCase());
          return dayIndex >= 0;
        });
      }

      const closestDay = closestDayIndex >= 0 ? days[closestDayIndex] : null;
      const resulFecha = obtenerFechaSiguiente(closestDay);

      saleModel.games.forEach(game => {
        if (game.loteria === lottery.name) {
          game.dateDayGame = resulFecha;
        }
      });
    }

    if (!responseSent) {
      saleModel.codeSecure = await generateUniqueRandomCode(9);
      saleModel.code = await generateCode();

      await saleModel.save();

      responseSuccess(res, 200, "venta registrada", saleModel._id);
    }
  } catch (error) {
    console.log(error);
    responseError(res, 500, "Error");
  }
};



function obtenerFechaSiguiente(diaSemana) {
  // Obtener la fecha actual
  const fechaActual = moment();

  const dayIndex = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'].indexOf(diaSemana.toLowerCase())

  // Verificar si el día proporcionado es el mismo que el día actual
  if (dayIndex === fechaActual.day()) {
    return fechaActual.format('YYYY-MM-DD');
  }

  // Calcular la diferencia de días hasta el próximo día de la semana deseado
  let diasHastaSiguiente = (dayIndex - fechaActual.day() + 7) % 7;

  // Si el resultado es 0, significa que ya estamos en ese día, así que avanzamos una semana
  if (diasHastaSiguiente === 0) {
    diasHastaSiguiente = 7;
  }

  // Calcular la fecha del próximo día de la semana
  const fechaSiguiente = fechaActual.add(diasHastaSiguiente, 'days');

  return fechaSiguiente.format('YYYY-MM-DD');
}

function obtenerFechaSiguienteHoy() {
  // Obtener la fecha actual
  const fechaActual = moment();
  const fechaResult = fechaActual.clone().add(7, 'days');
  return fechaResult.format('YYYY-MM-DD');
  
}


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

