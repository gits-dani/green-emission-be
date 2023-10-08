import { Router } from "express";
import { register, login, logout } from "../controllers/userController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const route = Router();

route.post("/register", register);
route.post("/login", login);
route.get("/logout", isAuthenticated, logout);

export default route;
