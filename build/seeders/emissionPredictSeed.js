"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Baca data dari file JSON
        const dataFilePath = path_1.default.resolve(__dirname, "emissionPredictData.json");
        const rawData = fs_1.default.readFileSync(dataFilePath, "utf-8");
        const jsonData = JSON.parse(rawData);
        // Masukkan data EmissionPredict ke dalam database
        yield prisma.emissionPredict.createMany({
            data: jsonData.map((data) => (Object.assign({}, data))),
        });
        console.log("Seeder selesai");
    }
    catch (error) {
        console.error("Seeder gagal:", error);
    }
    finally {
        yield prisma.$disconnect();
    }
});
main();
