import { Router } from "express";
import UserProfileController from "../controllers/userProfileController";

const route = Router();

route.post("/userProfile", UserProfileController.add);

export default route;
