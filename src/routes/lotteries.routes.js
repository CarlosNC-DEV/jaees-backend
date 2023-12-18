import { Router } from "express";
import { dataCreateLotteries } from '../middlewares/validate.data.js';
import { createLottieres, getAllLottieres } from '../controllers/lotteries.controller.js';

const router = Router();

router.get("/lotteries", getAllLottieres);
router.post("/lotteries", dataCreateLotteries, createLottieres);

export default router;
