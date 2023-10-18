import { Router } from "express";
import emissionPredictController from "../controllers/emissionPredictController";

const route = Router();

route.post("/emission-predict", emissionPredictController.add);

export default route;
