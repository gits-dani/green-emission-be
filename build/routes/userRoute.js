"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const route = (0, express_1.Router)();
route.post("/register", userController_1.default.register);
route.post("/login", userController_1.default.login);
route.get("/logout", isAuthenticated_1.isAuthenticated, userController_1.default.logout);
route.post("/change-password", isAuthenticated_1.isAuthenticated, userController_1.default.changePassword);
exports.default = route;
