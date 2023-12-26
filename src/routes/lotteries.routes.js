import { Router } from "express";
import { dataCreateLotteries, dataUpdateLotteries } from '../middlewares/validate.data.js';
import { createLottieres, getAllLottieres, updateAmountMax } from '../controllers/lotteries.controller.js';

const router = Router();

router.get("/lotteries", getAllLottieres);
router.post("/lotteries", dataCreateLotteries, createLottieres);
router.put("/lotteries/:id", dataUpdateLotteries, updateAmountMax);

export default router;
