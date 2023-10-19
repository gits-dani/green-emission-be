"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tipeKendaraanController_1 = __importDefault(require("../controllers/tipeKendaraanController"));
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const route = (0, express_1.Router)();
route.post("/tipe-kendaraan", isAuthenticated_1.isAuthenticated, tipeKendaraanController_1.default.add);
route.get("/tipe-kendaraan", isAuthenticated_1.isAuthenticated, tipeKendaraanController_1.default.getAll);
exports.default = route;
