import { Router } from "express";
import emissionPredictController from "../controllers/emissionPredictController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const route = Router();

route.post("/emission-predict", isAuthenticated, emissionPredictController.add);

export default route;
