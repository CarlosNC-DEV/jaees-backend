import { Router } from "express";
import { updateNewHorsh, updateSales, updateNewOline } from '../controllers/migrate.controllers.js';

const router = Router();

router.get("/updateLotteries", updateNewHorsh);
router.get("/updateSales", updateSales);
router.get("/updateUsers", updateNewOline);

export default router;
