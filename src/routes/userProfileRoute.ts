import { Router } from "express";
import UserProfileController from "../controllers/userProfileController";

const route = Router();

route.post("/userProfile", UserProfileController.add);
route.get("/userProfile", UserProfileController.get);

export default route;
