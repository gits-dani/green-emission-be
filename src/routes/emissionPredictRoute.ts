import { Router } from "express";
import emissionPredictController from "../controllers/emissionPredictController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const route = Router();

route.post("/emission-predict", isAuthenticated, emissionPredictController.add);
route.get(
  "/emission-predict",
  isAuthenticated,
  emissionPredictController.getAll
);

export default route;
