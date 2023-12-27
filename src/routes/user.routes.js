import { Router } from "express";
import { dataCreateUsers, dataAuthentication } from "../middlewares/validate.data.js";
import { authenticationUsers, createUsers, getUserById, getAllUser, updateStateUser } from "../controllers/users.controllers.js";

const router = Router();

router.get("/users", getAllUser);
router.get("/users/:id", getUserById);
router.post("/users", dataCreateUsers, createUsers);
router.put("/users/:id", updateStateUser);
router.post("/authentication", dataAuthentication, authenticationUsers);

export default router;
