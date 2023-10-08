"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userProfileController_1 = __importDefault(require("../controllers/userProfileController"));
const route = (0, express_1.Router)();
route.post("/userProfile", userProfileController_1.default.add);
exports.default = route;
