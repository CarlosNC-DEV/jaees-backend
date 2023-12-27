import { Router } from "express";
import { dataCreateLotteries, dataUpdateLotteries } from '../middlewares/validate.data.js';
import { createLottieres, getAllLottieres, getAllLottieresHabilitadas, updateAmountMax } from '../controllers/lotteries.controller.js';

const router = Router();

router.get("/lotteries", getAllLottieres);
router.get("/lotteries/ha", getAllLottieresHabilitadas);
router.post("/lotteries", dataCreateLotteries, createLottieres);
router.put("/lotteries/:id", dataUpdateLotteries, updateAmountMax);

export default router;
