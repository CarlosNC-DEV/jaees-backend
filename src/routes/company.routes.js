import { Router } from "express";
import { dataCreateAndUpdateCompany } from "../middlewares/validate.data.js";
import { createCompany, getCompanyById, updateCompany } from "../controllers/company.controllers.js";

const router = Router();

router.get("/company/:id", getCompanyById);
router.post("/company", dataCreateAndUpdateCompany, createCompany);
router.put("/company/:id", dataCreateAndUpdateCompany, updateCompany);

export default router;
