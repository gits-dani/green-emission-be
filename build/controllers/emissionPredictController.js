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
                const { nama_pemilik, no_plat, engine_size, cylinders, fuel_consumption_city, fuel_consumption_hwy, fuel_consumption_comb, fuel_consumption_comb_mpg, } = req.body;
                const tipe_kendaraan_id = parseInt(req.body.tipe_kendaraan_id);
                // validasi: jika data ada yang tidak terisi
                if (!nama_pemilik ||
                    !no_plat ||
                    !engine_size ||
                    !cylinders ||
                    !fuel_consumption_city ||
                    !fuel_consumption_hwy ||
                    !fuel_consumption_comb ||
                    !fuel_consumption_comb_mpg ||
                    !tipe_kendaraan_id) {
                    return res.status(400).json({
                        status: "error",
                        message: "Data nama_pemilik, no_plat tipe_kendaraan, engine_size, cylinders, fuel_consumption_city, fuel_consumption_hwy,fuel_consumption_comb dan fuel_consumption_comb_mpg harus diisi",
                    });
                }
                // cek tipe kendaraan di db
                const tipe_kendaraan = yield this.prisma.tipeKendaraan.findUnique({
                    where: {
                        id: tipe_kendaraan_id,
                    },
                });
                // validasi: jika tipe kendaraan tidak ditemukan
                if (!tipe_kendaraan) {
                    return res.status(404).json({
                        status: "error",
                        message: "Tipe kendaraan tidak ditemukan",
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
                // proses input ke model
                // proses membuat object dari data output model untuk dimasukkan ke db
                // waktu: untuk menentukan saat melakukan prediksi
                const waktuWIB = moment_timezone_1.default.utc().tz("Asia/Jakarta").format();
                // object inputan emissionPredict db
                const newEmissionPredict = Object.assign(Object.assign({ nama_pemilik,
                    no_plat }, inputanModel), { emisi: parseFloat("4.9"), prediksi: "Aman", waktu: waktuWIB });
                // proses add data
                const emissionPredict = yield this.prisma.emissionPredict.create({
                    data: Object.assign(Object.assign({}, newEmissionPredict), { tipe_kendaraan: {
                            connect: {
                                id: tipe_kendaraan_id,
                            },
                        } }),
                });
                // berikan response success
                return res.status(201).json({
                    status: "success",
                    message: "Berhasil prediksi emissi",
                    emissionPredictId: emissionPredict.id,
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: "error",
                    message: error.message,
                });
            }
        });
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // proses ambil semua data
                const emissionPredict = yield this.prisma.emissionPredict.findMany();
                // berikan response success
                return res.json({
                    status: "success",
                    message: "Berhasil mengambil semua data",
                    emissionPredict,
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: "error",
                    message: error.message,
                });
            }
        });
        this.getOne = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // ambil id dari req.params.id
                const id = parseInt(req.params.id);
                // cek id di database
                const emissionPredict = yield this.prisma.emissionPredict.findUnique({
                    where: {
                        id,
                    },
                });
                // validasi: jika data emission predict tidak ada
                if (!emissionPredict) {
                    return res.status(404).json({
                        status: "error",
                        message: "Data emission predict tidak ditemukan",
                    });
                }
                // berikan response success
                return res.json({
                    status: "success",
                    message: "Berhasil mengambil satu data emission predict",
                    emissionPredict,
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: "error",
                    message: error.message,
                });
            }
        });
        this.edit = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // ambil id dari req.params.id
                const id = parseInt(req.params.id);
                // cek data di db
                const emissionPredict = yield this.prisma.emissionPredict.findUnique({
                    where: {
                        id,
                    },
                });
                // console.log(emissionPredict);
                // validasi: jika data tidak ada
                if (!emissionPredict) {
                    return res.status(404).json({
                        status: "error",
                        message: "Data emission predict tidak ditemukan",
                    });
                }
                // ambil data dari req.body
                const { nama_pemilik, no_plat, engine_size, cylinders, fuel_consumption_city, fuel_consumption_hwy, fuel_consumption_comb, fuel_consumption_comb_mpg, tipe_kendaraan_id, } = req.body;
                const waktuWIB = moment_timezone_1.default.utc().tz("Asia/Jakarta").format();
                // cek data tipe kendaraan di db
                const tipe_kendaraan = yield this.prisma.tipeKendaraan.findUnique({
                    where: {
                        id: parseInt(tipe_kendaraan_id),
                    },
                });
                // validasi: jika data tipe kendaraan tidak ada
                if (!tipe_kendaraan) {
                    return res.status(404).json({
                        status: "error",
                        message: "Data tipe kendaraan tidak ditemukan",
                    });
                }
                // validasi: jika data ada yang berubah
                // membandingkan data yang dikirim oleh user dari req.body dan data emissonPredict yang ada di db
                // jika ada data inputan model seperti engine_size, cylinders dll yang dirubah maka masuk ke proses update data pertama, dan jika tidak ada data inputan model yang dirubah maka masuk ke proses update data kedua
                const isNamaPemilik = nama_pemilik !== emissionPredict.nama_pemilik;
                const isNoPlat = no_plat !== emissionPredict.no_plat;
                const isTipeKendaraanId = parseFloat(tipe_kendaraan_id) !== emissionPredict.tipe_kendaraan_id;
                const isEngineSizeChanged = parseFloat(engine_size) !== emissionPredict.engine_size;
                const isCylindersChanged = parseFloat(cylinders) !== emissionPredict.cylinders;
                const isFuelConsumptionCityChanged = parseFloat(fuel_consumption_city) !==
                    emissionPredict.fuel_consumption_city;
                const isFuelConsumtionHwyChanged = parseFloat(fuel_consumption_hwy) !==
                    emissionPredict.fuel_consumption_hwy;
                const isFuelConsumptionCombChanged = parseFloat(fuel_consumption_comb) !==
                    emissionPredict.fuel_consumption_comb;
                const isFuelConsumptionCombMpgChanged = parseFloat(fuel_consumption_comb_mpg) !==
                    emissionPredict.fuel_consumption_comb_mpg;
                console.log(`${isEngineSizeChanged} || ${isCylindersChanged} || ${isFuelConsumptionCityChanged} || ${isFuelConsumtionHwyChanged} || ${isFuelConsumptionCombChanged} || ${isFuelConsumptionCombMpgChanged}`);
                // validasi: jika data inputan ke model machine learning dirubah
                if (isEngineSizeChanged ||
                    isCylindersChanged ||
                    isFuelConsumptionCityChanged ||
                    isFuelConsumtionHwyChanged ||
                    isFuelConsumptionCombChanged ||
                    isFuelConsumptionCombMpgChanged) {
                    // buat object inputan mode
                    // melakukan pengecekan, jika data dirubah maka pakai data itu, jika tidak maka pakai data lama
                    const inputanModel = {
                        engine_size: isEngineSizeChanged
                            ? parseFloat(engine_size)
                            : (emissionPredict === null || emissionPredict === void 0 ? void 0 : emissionPredict.engine_size) || 0,
                        cylinders: isCylindersChanged
                            ? parseFloat(cylinders)
                            : (emissionPredict === null || emissionPredict === void 0 ? void 0 : emissionPredict.cylinders) || 0,
                        fuel_consumption_city: isFuelConsumptionCityChanged
                            ? parseFloat(fuel_consumption_city)
                            : (emissionPredict === null || emissionPredict === void 0 ? void 0 : emissionPredict.fuel_consumption_city) || 0,
                        fuel_consumption_hwy: isFuelConsumtionHwyChanged
                            ? parseFloat(fuel_consumption_hwy)
                            : (emissionPredict === null || emissionPredict === void 0 ? void 0 : emissionPredict.fuel_consumption_hwy) || 0,
                        fuel_consumption_comb: isFuelConsumptionCombChanged
                            ? parseFloat(fuel_consumption_comb)
                            : (emissionPredict === null || emissionPredict === void 0 ? void 0 : emissionPredict.fuel_consumption_comb) || 0,
                        fuel_consumption_comb_mpg: isFuelConsumptionCombMpgChanged
                            ? parseFloat(fuel_consumption_comb_mpg)
                            : (emissionPredict === null || emissionPredict === void 0 ? void 0 : emissionPredict.fuel_consumption_comb_mpg) || 0,
                    };
                    // object emission predict baru untuk data update
                    const newEmissionPredict = Object.assign(Object.assign({ nama_pemilik: isNamaPemilik
                            ? nama_pemilik
                            : (emissionPredict === null || emissionPredict === void 0 ? void 0 : emissionPredict.nama_pemilik) || "", no_plat: isNoPlat ? no_plat : (emissionPredict === null || emissionPredict === void 0 ? void 0 : emissionPredict.no_plat) || "", tipe_kendaraan_id: isTipeKendaraanId
                            ? parseInt(tipe_kendaraan_id)
                            : emissionPredict === null || emissionPredict === void 0 ? void 0 : emissionPredict.tipe_kendaraan_id }, inputanModel), { emisi: 4.9, prediksi: "Aman Update", waktu: waktuWIB });
                    // proses memasukkan data ke model machine learning dan ambil outputnya untuk update data ke db
                    const updateEmissionPredict = yield this.prisma.emissionPredict.update({
                        where: {
                            id,
                        },
                        data: newEmissionPredict,
                    });
                    // berikan response success
                    return res.json({
                        status: "success",
                        message: "Berhasil mengedit data inputan model",
                        emissionPredictId: updateEmissionPredict.id,
                    });
                }
                else if (isNamaPemilik || isNoPlat || isTipeKendaraanId) {
                    // object emission predict baru untuk data update
                    const newEmissionPredict = {
                        nama_pemilik: isNamaPemilik
                            ? nama_pemilik
                            : (emissionPredict === null || emissionPredict === void 0 ? void 0 : emissionPredict.nama_pemilik) || "",
                        no_plat: isNoPlat ? no_plat : (emissionPredict === null || emissionPredict === void 0 ? void 0 : emissionPredict.no_plat) || "",
                        tipe_kendaraan_id: isTipeKendaraanId
                            ? parseInt(tipe_kendaraan_id)
                            : emissionPredict === null || emissionPredict === void 0 ? void 0 : emissionPredict.tipe_kendaraan_id,
                    };
                    // proses update data
                    const updateEmissionPredict = yield this.prisma.emissionPredict.update({
                        where: {
                            id,
                        },
                        data: newEmissionPredict,
                    });
                    // berikan response success
                    return res.json({
                        status: "success",
                        message: "Berhasil mengedit data biasa",
                        emissionPredictId: updateEmissionPredict.id,
                    });
                }
                else {
                    // berikan response success
                    return res.json({
                        status: "success",
                        message: "Berhasil mengedit data biasa ajaaaaaaaaaaaa",
                        emissionPredictId: emissionPredict.id,
                    });
                }
            }
            catch (error) {
                return res.status(500).json({
                    status: "error",
                    message: error.message,
                });
            }
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // ambil id dari req.params.id
                const id = parseInt(req.params.id);
                // cek id di database
                const emissionPredict = yield this.prisma.emissionPredict.findUnique({
                    where: {
                        id,
                    },
                });
                // validasi: jika data emisison predict tidak ditemukan
                if (!emissionPredict) {
                    return res.status(404).json({
                        status: "error",
                        message: "Data emission predict tidak ditemukan",
                    });
                }
                // proses hapus data
                yield this.prisma.emissionPredict.delete({
                    where: {
                        id,
                    },
                });
                return res.json({
                    status: "success",
                    message: "Berhasil menghapus satu data emission predict",
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
