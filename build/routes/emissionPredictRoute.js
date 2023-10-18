"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const emissionPredictController_1 = __importDefault(require("../controllers/emissionPredictController"));
const route = (0, express_1.Router)();
route.post("/emission-predict", emissionPredictController_1.default.add);
exports.default = route;
