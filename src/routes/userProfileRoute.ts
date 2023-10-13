import { Router } from "express";
import UserProfileController from "../controllers/userProfileController";
import { upload } from "../middlewares/upload";

const route = Router();

route.post("/user-profile", UserProfileController.add);
route.get("/user-profile", UserProfileController.get);
route.post(
  "/user-profile/upload-foto-profil",
  upload.single("foto_profil"),
  UserProfileController.addFotoProfil
);

export default route;
