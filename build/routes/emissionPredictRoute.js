"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const emissionPredictController_1 = __importDefault(require("../controllers/emissionPredictController"));
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const route = (0, express_1.Router)();
route.post("/emission-predict", emissionPredictController_1.default.add);
route.get("/emission-predict", emissionPredictController_1.default.getAll);
route.get("/emission-predict/:id", emissionPredictController_1.default.getOne);
route.put("/emission-predict/:id", emissionPredictController_1.default.edit);
route.delete("/emission-predict/:id", isAuthenticated_1.isAuthenticated, emissionPredictController_1.default.delete);
exports.default = route;
