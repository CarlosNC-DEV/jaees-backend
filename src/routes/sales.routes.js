import { Router } from "express";
import { dataCreateSales } from "../middlewares/validate.data.js";
import { createSales, getAllSales, getSalesById, getSalesByIdUser, getSalesByDate, getSalesByDateRange, getSalesByIdUserSales } from "../controllers/sales.controllers.js";

const router = Router();

router.get("/sales", getAllSales);
router.get("/sales/:id", getSalesById);
router.get("/salesByUser/:id", getSalesByIdUser);
router.get("/salesByIdUser/:idUser", getSalesByIdUserSales);
router.get("/salesByDateIdUser/:date/:id", getSalesByDate);
router.get("/salesByDateRange/:startDate/:endDate/:id", getSalesByDateRange);
router.post("/sales", dataCreateSales , createSales);

export default router;
