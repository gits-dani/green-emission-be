import { Router } from "express";
import userController from "../controllers/userController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const route = Router();

route.post("/register", userController.register);
route.post("/login", userController.login);
route.get("/logout", isAuthenticated, userController.logout);
route.post("/change-password", isAuthenticated, userController.changePassword);

export default route;
