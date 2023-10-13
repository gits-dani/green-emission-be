"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userProfileController_1 = __importDefault(require("../controllers/userProfileController"));
const upload_1 = require("../middlewares/upload");
const route = (0, express_1.Router)();
route.post("/user-profile", userProfileController_1.default.add);
route.get("/user-profile", userProfileController_1.default.get);
route.post("/user-profile/upload-foto-profil", upload_1.upload.single("foto_profil"), userProfileController_1.default.addFotoProfil);
exports.default = route;
