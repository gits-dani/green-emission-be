import { Router } from "express";
import tipeKendaraanController from "../controllers/tipeKendaraanController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const route = Router();

route.post("/tipe-kendaraan", isAuthenticated, tipeKendaraanController.add);
route.get("/tipe-kendaraan", isAuthenticated, tipeKendaraanController.getAll);

export default route;
