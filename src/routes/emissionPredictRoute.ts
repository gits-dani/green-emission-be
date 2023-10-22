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
route.get(
  "/emission-predict/:id",
  isAuthenticated,
  emissionPredictController.getOne
);

route.put(
  "/emission-predict/:id",
  isAuthenticated,
  emissionPredictController.edit
);

route.delete(
  "/emission-predict/:id",
  isAuthenticated,
  emissionPredictController.delete
);

export default route;
