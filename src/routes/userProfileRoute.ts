import { Router } from "express";
import UserProfileController from "../controllers/userProfileController";

const route = Router();

route.post("/user-profile", UserProfileController.add);
route.get("/user-profile", UserProfileController.get);

export default route;
