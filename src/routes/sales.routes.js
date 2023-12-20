import { Router } from "express";
import { dataCreateSales } from "../middlewares/validate.data.js";
import { createSales, getAllSales, getSalesById, getSalesByIdUser } from "../controllers/sales.controllers.js";

const router = Router();

router.get("/sales", getAllSales);
router.get("/sales/:id", getSalesById);
router.get("/salesByUser/:id", getSalesByIdUser);
router.post("/sales", dataCreateSales , createSales);

export default router;
