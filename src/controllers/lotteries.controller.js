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

    const timeZone = 'America/Santiago';
    const options = { weekday: 'long' };
    const now = new Date(new Date().toLocaleString('en-US', { timeZone }));
    const formattedDate = now.toLocaleDateString('es-US', options).toLowerCase();
    const hours = now.getHours();
    const minutes = now.getMinutes();


    const allLottieres = await LotteriesModel.find({state:true});

    const lotteriesToday = allLottieres.filter(lottery => {
      const timeHoursSplit = lottery.hoursGame.split(":")
      const hourLotteries = parseInt(timeHoursSplit[0])
      const minuteLotteries = parseInt(timeHoursSplit[1])

      return lottery.dayGames.includes(formattedDate) && (
          hourLotteries > hours || // La hora de la lotería es después de la hora actual
          (hourLotteries === hours && minuteLotteries > minutes) // La hora de la lotería es la misma pero el minuto es posterior o igual al minuto actual
      )
    });

    return responseSuccess(res, 200, "loterias", lotteriesToday);

  } catch (error) {
    console.log(error)
    return responseError(res, 500, "error");
  }
};

export const updateAmountMax = async(req, res)=>{
  try {
    const lotteriesUpdate = await LotteriesModel.findByIdAndUpdate(req.params.id, 
    { amountMax: req.body.amountMax, 
      state:req.body.state, 
      name:req.body.name, 
      dayGames:req.body.dayGames,
      hoursGame:req.body.hoursGame
    });
    
    if(!lotteriesUpdate){
      return responseError(res, 200, "No fue posible actualizar la loteria");
    }

  
    return responseSuccess(res, 200, "loteria actualizada");

  } catch (error) {
    return responseError(res, 500, "error");
  }
}






