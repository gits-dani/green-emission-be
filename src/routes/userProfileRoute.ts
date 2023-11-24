import { Router } from "express";
import UserProfileController from "../controllers/userProfileController";
import { upload } from "../middlewares/upload";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const route = Router();

route.post(
  "/user-profile",
  isAuthenticated,
  upload.single("foto_profil"),
  UserProfileController.add
);
route.get("/user-profile/:user_id", isAuthenticated, UserProfileController.get);
route.post(
  "/user-profile/upload-foto-profil",
  isAuthenticated,
  upload.single("foto_profil"),
  UserProfileController.addFotoProfil
);

export default route;
