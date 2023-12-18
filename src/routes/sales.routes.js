import { Router } from "express";
import { dataCreateSales } from "../middlewares/validate.data.js";
import { createSales, getAllSales } from "../controllers/sales.controllers.js";

const router = Router();

router.get("/sales", getAllSales);
router.post("/sales", dataCreateSales , createSales);

export default router;
