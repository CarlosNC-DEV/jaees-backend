import WinnersModel from "../models/winners.model.js";
import SalesModel from "../models/sales.model.js";
import LotterieModel from "../models/lotteries.model.js";
import {
  responseSuccess,
  responseError,
} from "../middlewares/responses.default.js";

export const createWinners = async(req, res)=>{
    try {

        const lotterieFound = await LotterieModel.findOne({name:req.body.lottery})
        const ventas = await SalesModel.find({
            'games.dateDayGame': req.body.dateGame,
            'games.loteria': req.body.lottery,
            'games.numGame': req.body.numGame
        }).populate("idSaller")

        const foundWinner = await WinnersModel.findOne({
            lottery:lotterieFound._id, 
            dateGame:req.body.dateGame, 
        })

        if(!foundWinner){
            const saveWinners = new WinnersModel({
                numGame:req.body.numGame, 
                lottery:lotterieFound._id, 
                dateGame:req.body.dateGame, 
                winners:ventas 
            })

            await saveWinners.save()

            return responseSuccess(res, 200, "numero ganador registrador", ventas);

        }else{
            return responseError(res, 200, "loteria con numero ganador en fecha ya registrado");
        }
    } catch (error) {
        console.log(error)
        return responseError(res, 500, "error");
    }
}

export const getNumberWinner = async(req, res)=>{
    try {

        const lotterieFound = await LotterieModel.findOne({name:req.body.lottery})

        const winnerFound = await WinnersModel.findOne({ lottery:lotterieFound._id, dateGame:req.body.dateGame}).populate("lottery")

        if(!winnerFound){
            return responseError(res, 200, "loteria sin numero ganador en la fecha");
        }

        return responseSuccess(res, 200, "numero ganador", winnerFound);

    } catch (error) {
        console.log(error)
        return responseError(res, 500, "error");
    }
}

export const updateWinners = async(req, res)=>{
    try {

        const lotterieFound = await LotterieModel.findOne({name:req.body.lottery})
        const ventas = await SalesModel.find({
            'games.dateDayGame': req.body.dateGame,
            'games.loteria': req.body.lottery,
            'games.numGame': req.body.numGame
        }).populate("idSaller")

        // Verificar si existe otro ganador con la misma fecha y loteria
        const existingWinner = await WinnersModel.findOne({
            dateGame: req.body.dateGame,
            lottery:lotterieFound._id,
            _id: { $ne: req.params.id } // Excluir el actual ganador de la búsqueda
        });

        if (existingWinner) {
            return responseError(res, 200, "loteria con numero ganador en fecha ya registrado");
        }

        // Realizar la actualización si las validaciones pasan
        const updatedWinner = await WinnersModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    numGame: req.body.numGame,
                    lottery: lotterieFound._id,
                    dateGame: req.body.dateGame,
                    winners: ventas
                }
            },
            { new: true }
        );

        if (updatedWinner) {
            return responseSuccess(res, 200, "Número ganador actualizado", null);
        } else {
            return responseError(res, 200, "No se encontró un ganador para actualizar");
        }
    
    } catch (error) {
        console.log(error)
        return responseError(res, 500, "error");
    }
}



