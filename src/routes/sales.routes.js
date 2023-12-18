import { Router } from "express";
import { dataCreateSales } from "../middlewares/validate.data.js";
import { createSales, getAllSales, getSalesById } from "../controllers/sales.controllers.js";

const router = Router();

router.get("/sales", getAllSales);
router.get("/sales/:id", getSalesById);
router.post("/sales", dataCreateSales , createSales);

export default router;
