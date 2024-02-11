import { Router } from "express";
import { updateNewHorsh, updateNewTime, updateSales, updateNewOline } from '../controllers/migrate.controllers.js';

const router = Router();

router.get("/updateLotteries", updateNewHorsh);
router.get("/updateSalesTime", updateNewTime);
router.get("/updateSales", updateSales);
router.get("/updateUsers", updateNewOline);

export default router;
