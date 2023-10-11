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
const dayjs_1 = __importDefault(require("dayjs"));
class UserProfileController {
    constructor() {
        // tambah user profile
        // -> jika belum ada user profile berdasarkan user_id, maka buat dulu data user profilenya
        // -> jika sudah ada user profile berdasarkan user_id, maka update saja data user profilenya
        this.add = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Ambil data dari req.body
                const { nama, no_hp, tanggal_lahir, alamat, user_id } = req.body;
                const tanggal_lahir_iso = (0, dayjs_1.default)(tanggal_lahir).toISOString();
                // Cari user di database
                const user = yield this.prisma.user.findUnique({
                    where: {
                        id: user_id,
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
                        user_id: user_id,
                    },
                });
                // Buat object user profile
                const newUserProfile = {
                    nama: nama || (userProfile === null || userProfile === void 0 ? void 0 : userProfile.nama) || "",
                    no_hp: no_hp || (userProfile === null || userProfile === void 0 ? void 0 : userProfile.no_hp) || "",
                    tanggal_lahir: tanggal_lahir_iso || (userProfile === null || userProfile === void 0 ? void 0 : userProfile.tanggal_lahir) || "",
                    alamat: alamat || (userProfile === null || userProfile === void 0 ? void 0 : userProfile.alamat) || "",
                };
                if (userProfile) {
                    // Jika userProfile sudah ada, update data saja
                    yield this.prisma.userProfile.update({
                        data: newUserProfile,
                        where: {
                            user_id: user_id,
                        },
                    });
                }
                else {
                    // Jika userProfile belum ada, tambahkan data baru
                    yield this.prisma.userProfile.create({
                        data: Object.assign(Object.assign({}, newUserProfile), { user: {
                                connect: {
                                    id: user_id,
                                },
                            } }),
                    });
                }
                // Response sukses
                return res.status(201).json({
                    status: "success",
                    message: "Berhasil menambahkan user profile",
                });
            }
            catch (error) {
                // Tangani kesalahan
                console.error(error);
                return res.status(500).json({
                    status: "error",
                    message: "Terjadi kesalahan internal",
                });
            }
        });
        this.prisma = new client_1.PrismaClient();
    }
}
exports.default = new UserProfileController();
