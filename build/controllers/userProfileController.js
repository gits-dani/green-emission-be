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
class UserProfileController {
    constructor() {
        this.add = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Ambil data dari req.body
                const { nama, no_hp, tanggal_lahir, alamat, user_id } = req.body;
                // Cek user di database
                const user = yield this.prisma.user.findUnique({
                    where: {
                        id: parseInt(user_id),
                    },
                });
                // Validasi: jika user tidak ditemukan
                if (!user) {
                    return res
                        .status(404)
                        .json({ status: "error", message: "User tidak ditemukan" });
                }
                // Cari userProfile berdasarkan user_id
                const userProfile = yield this.prisma.userProfile.findUnique({
                    where: {
                        user_id: parseInt(user_id),
                    },
                });
                // Proses pembuatan userProfile
                yield this.prisma.userProfile.create({
                    data: {
                        nama: nama || (userProfile === null || userProfile === void 0 ? void 0 : userProfile.nama) || "",
                        no_hp: no_hp || (userProfile === null || userProfile === void 0 ? void 0 : userProfile.no_hp) || "",
                        tanggal_lahir: tanggal_lahir || (userProfile === null || userProfile === void 0 ? void 0 : userProfile.tanggal_lahir) || "",
                        alamat: alamat || (userProfile === null || userProfile === void 0 ? void 0 : userProfile.alamat) || "",
                        user: {
                            connect: {
                                id: parseInt(user_id), // menghubungkan dengan tabel user
                            },
                        },
                    },
                });
                // Response sukses
                return res.status(201).json({
                    status: "success",
                    message: "Berhasil menambahkan user profile",
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
exports.default = new UserProfileController();
