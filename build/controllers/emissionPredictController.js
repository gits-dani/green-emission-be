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
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class EmissionPredictController {
    constructor() {
        this.add = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // ambil data dari req.body
                const { nama_pemilik, no_plat, tipe_kendaraan, engine_size, cylinders, fuel_consumption_city, fuel_consumption_hwy, fuel_consumption_comb, fuel_consumption_comb_mpg, } = req.body;
                // validasi: jika data ada yang tidak terisi
                if (!nama_pemilik ||
                    !no_plat ||
                    !tipe_kendaraan ||
                    !engine_size ||
                    !cylinders ||
                    !fuel_consumption_city ||
                    !fuel_consumption_hwy ||
                    !fuel_consumption_comb ||
                    !fuel_consumption_comb_mpg) {
                    return res.status(400).json({
                        status: "error",
                        message: "Data nama_pemilik, no_plat tipe_kendaraan, engine_size, cylinders, fuel_consumption_city, fuel_consumption_hwy,fuel_consumption_comb dan fuel_consumption_comb_mpg harus diisi",
                    });
                }
                // buat object inputan mode
                const inputanModel = {
                    engine_size: parseFloat(engine_size),
                    cylinders: parseFloat(cylinders),
                    fuel_consumption_city: parseFloat(fuel_consumption_city),
                    fuel_consumption_hwy: parseFloat(fuel_consumption_hwy),
                    fuel_consumption_comb: parseFloat(fuel_consumption_comb),
                    fuel_consumption_comb_mpg: parseFloat(fuel_consumption_comb_mpg),
                };
                // waktu: untuk menentukan saat melakukan prediksi
                const waktuWIB = moment_timezone_1.default.utc().tz("Asia/Jakarta").format();
                // object inputan emissionPredict db
                const newEmissionPredict = {
                    nama_pemilik,
                    no_plat,
                    tipe_kendaraan,
                    emisi: parseFloat("4.9"),
                    prediksi: "Aman",
                    waktu: waktuWIB,
                };
                // proses add data
                // const emissionPredict = await this.prisma.emissionPredict.create({
                //   data: newEmissionPredict,
                // });
                // berikan response success
                return res.status(201).json({
                    status: "success",
                    message: "Berhasil prediksi emissi",
                    // emissionPredict,
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: "error",
                    message: error.message,
                });
            }
        });
        this.prisma = new client_1.PrismaClient();
    }
}
exports.default = new EmissionPredictController();
