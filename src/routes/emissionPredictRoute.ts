import { Router } from "express";
import emissionPredictController from "../controllers/emissionPredictController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const route = Router();

route.post("/emission-predict", emissionPredictController.add);
route.get(
  "/emission-predict",
  isAuthenticated,
  emissionPredictController.getAll
);
route.get("/emission-predict/:id", emissionPredictController.getOne);

route.put("/emission-predict/:id", emissionPredictController.edit);

route.delete(
  "/emission-predict/:id",
  isAuthenticated,
  emissionPredictController.delete
);

route.get("/predict-emission", emissionPredictController.emissionPredict);

export default route;
