import { Router } from "express";
import { dataCreateWinners, dateGetWinners } from "../middlewares/validate.data.js";
import { createWinners, getNumberWinner, updateWinners } from "../controllers/winners.controllers.js";

const router = Router();

router.post("/winners", dataCreateWinners, createWinners);
router.post("/winner", dateGetWinners, getNumberWinner);
router.put("/winners/:id", dataCreateWinners, updateWinners);

export default router;
