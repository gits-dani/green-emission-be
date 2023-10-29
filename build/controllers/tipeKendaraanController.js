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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class TipeKendaraanController {
    constructor() {
        this.add = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // ambil data dari req.body
                const { tipe } = req.body;
                // validasi: jika tidak memasukkan data tipe
                if (!tipe) {
                    return res.status(400).json({
                        status: "error",
                        message: "Data tipe harus diisi",
                    });
                }
                // proses add / create data ke db
                const tipeKendaraan = yield this.prisma.tipeKendaraan.create({
                    data: {
                        tipe,
                    },
                });
                // berikan response success
                return res.status(201).json({
                    status: "success",
                    message: "Berhasil menambahkan tipe kendaraan",
                    id: tipeKendaraan.id,
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
                const tipeKendaraan = yield this.prisma.tipeKendaraan.findMany({
                    select: {
                        id: true,
                        tipe: true,
                    },
                });
                // berikan response success
                return res.json({
                    status: "success",
                    message: "Berhasil mengambil semua data",
                    tipeKendaraan,
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
exports.default = new TipeKendaraanController();
