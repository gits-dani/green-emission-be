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
const validator_1 = __importDefault(require("validator"));
const uploadImageToImgBB_1 = require("../utils/uploadImageToImgBB");
class UserProfileController {
    constructor() {
        // tambah user profile
        // -> jika belum ada user profile berdasarkan user_id, maka buat dulu data user profilenya
        // -> jika sudah ada user profile berdasarkan user_id, maka update saja data user profilenya
        this.add2 = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // ambil data user_id dan konversi ke number pake op unary;
                console.log(req.body);
                const user_id = +req.body.user_id;
                // console.log(user_id);
                // Cari user di database
                const user = yield this.prisma.user.findUnique({
                    where: {
                        id: user_id,
                    },
                });
                // Validasi: jika user tidak ditemukan
                if (!user) {
                    return res.status(404).json({
                        status: "error",
                        message: "User tidak ditemukan",
                    });
                }
                // Ambil data dari req.body
                const { nama, no_hp, tanggal_lahir, alamat } = req.body;
                // convert ke format ISO (2023-08-27)
                const tanggal_lahir_iso = (0, dayjs_1.default)(tanggal_lahir).toISOString();
                // validasi: apakah no_hp valid
                if (!validator_1.default.isMobilePhone(no_hp, "id-ID")) {
                    return res.status(400).json({
                        status: "error",
                        message: "No Hp tidak valid",
                    });
                }
                // Cari userProfile berdasarkan user_id
                const userProfile = yield this.prisma.userProfile.findUnique({
                    where: {
                        user_id,
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
                    const updateUserProfile = yield this.prisma.userProfile.update({
                        data: newUserProfile,
                        where: {
                            user_id,
                        },
                    });
                    // Response sukses
                    return res.status(201).json({
                        status: "success",
                        message: "Berhasil menambahkan user profile",
                        userProfileId: updateUserProfile.id,
                    });
                }
                else {
                    // Jika userProfile belum ada, tambahkan data baru
                    const createUserProfile = yield this.prisma.userProfile.create({
                        data: Object.assign(Object.assign({}, newUserProfile), { user: {
                                connect: {
                                    id: user_id,
                                },
                            } }),
                    });
                    // Response sukses
                    return res.status(201).json({
                        status: "success",
                        message: "Berhasil menambahkan user profile",
                        userProfileId: createUserProfile.id,
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
        this.add = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // ambil data user_id;
                const user_id = parseInt(req.body.user_id);
                // Cari user di database
                const user = yield this.prisma.user.findUnique({
                    where: {
                        id: user_id,
                    },
                });
                // Validasi: jika user tidak ditemukan
                if (!user) {
                    return res.status(404).json({
                        status: "error",
                        message: "User tidak ditemukan",
                    });
                }
                // Ambil data dari req.body
                const { nama, no_hp, tanggal_lahir, alamat } = req.body;
                // convert ke format ISO (2023-08-27)
                const tanggal_lahir_iso = (0, dayjs_1.default)(tanggal_lahir).toISOString();
                // validasi: apakah no_hp valid
                if (!validator_1.default.isMobilePhone(no_hp, "id-ID")) {
                    return res.status(400).json({
                        status: "error",
                        message: "No Hp tidak valid",
                    });
                }
                let imageUrl;
                // validasi: jika user mengirimkan file gambar
                if (req.file) {
                    // ambil data file dan isi dengan file buffernya
                    const fileBuffer = req.file.buffer;
                    // proses upload image ke imgbb
                    imageUrl = yield (0, uploadImageToImgBB_1.uploadImageToImgBB)(fileBuffer, req.file.originalname);
                    // validasi: jika gambar gagal terupload
                    if (!imageUrl) {
                        return res.status(400).json({
                            status: "error",
                            message: "Gambar gagal terupload",
                        });
                    }
                    // setelah gambar berhasil terupload, hapus isi file buffer
                    req.file.buffer = Buffer.alloc(0);
                }
                // Cari userProfile berdasarkan user_id
                const userProfile = yield this.prisma.userProfile.findUnique({
                    where: {
                        user_id,
                    },
                });
                // Buat object user profile
                const newUserProfile = {
                    nama: nama || (userProfile === null || userProfile === void 0 ? void 0 : userProfile.nama) || "",
                    no_hp: no_hp || (userProfile === null || userProfile === void 0 ? void 0 : userProfile.no_hp) || "",
                    tanggal_lahir: tanggal_lahir_iso || (userProfile === null || userProfile === void 0 ? void 0 : userProfile.tanggal_lahir) || "",
                    alamat: alamat || (userProfile === null || userProfile === void 0 ? void 0 : userProfile.alamat) || "",
                    foto_profil: imageUrl || (userProfile === null || userProfile === void 0 ? void 0 : userProfile.foto_profil) || "",
                };
                // validasi: tindakan jika userProfile sudah ada / belum ada
                if (userProfile) {
                    // Jika userProfile sudah ada, update data saja
                    const updateUserProfile = yield this.prisma.userProfile.update({
                        data: newUserProfile,
                        where: {
                            user_id,
                        },
                    });
                    // Response sukses
                    return res.status(201).json({
                        status: "success",
                        message: "Berhasil menambahkan user profile",
                        userProfileId: updateUserProfile.id,
                    });
                }
                else {
                    // Jika userProfile belum ada, tambahkan data baru
                    const createUserProfile = yield this.prisma.userProfile.create({
                        data: Object.assign(Object.assign({}, newUserProfile), { user: {
                                connect: {
                                    id: user_id,
                                },
                            } }),
                    });
                    // Response sukses
                    return res.status(201).json({
                        status: "success",
                        message: "Berhasil menambahkan user profile",
                        userProfileId: createUserProfile.id,
                    });
                }
            }
            catch (error) {
                // Tangani kesalahan
                return res.status(500).json({
                    status: "error",
                    message: error.message,
                });
            }
        });
        this.get = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // ambil data user_id dari req.body
                const user_id = parseInt(req.params.user_id);
                // cek user profile berdasarkan user_id
                const userProfile = yield this.prisma.userProfile.findUnique({
                    where: {
                        user_id,
                    },
                });
                // validasi: jika user profile tidak ada
                if (!userProfile) {
                    return res
                        .status(404)
                        .json({ status: "error", message: "User Profile tidak ditemukan" });
                }
                // berikan response success
                return res.json({
                    status: "success",
                    message: "Berhasil mengambil data user profile",
                    userProfile,
                });
                // prosses ambil user profile berdasarkan id
            }
            catch (error) {
                return res.status(500).json({ status: "error", message: error.message });
            }
        });
        this.addFotoProfil = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // ambil id user
                const user_id = parseInt(req.body.user_id);
                console.log(user_id);
                // cek user berdasarkan user_id
                const user = yield this.prisma.user.findUnique({
                    where: {
                        id: user_id,
                    },
                });
                // validasi: jika user tidak ditemukan
                if (!user) {
                    return res.status(404).json({
                        status: "error",
                        message: "User tidak ditemukan",
                    });
                }
                // ambil data file
                // jika ada file yang diupload, isi dengan file buffernya klo ga ada isi null
                const fileBuffer = req.file ? req.file.buffer : null;
                // validasi: jika tidak ada file gambar yang dipilih
                if (!req.file) {
                    return res.status(400).json({
                        status: "error",
                        message: "File gambar tidak ditemukan",
                    });
                }
                // proses upload image ke imgbb
                const imageUrl = yield (0, uploadImageToImgBB_1.uploadImageToImgBB)(fileBuffer, req.file.originalname);
                // validasi: jika gambar gagal terupload
                if (!imageUrl) {
                    return res.status(400).json({
                        status: "error",
                        message: "Gambar gagal terupload",
                    });
                }
                // setelah gambar berhasil terupload, hapus isi file buffer
                req.file.buffer = Buffer.alloc(0);
                // proses update data
                const userProfile = yield this.prisma.userProfile.update({
                    data: {
                        foto_profil: imageUrl,
                    },
                    where: {
                        user_id,
                    },
                });
                // berikan response success
                return res.json({
                    status: "success",
                    message: "Berhasil menambahkan foto profil",
                    userProfileId: userProfile.id,
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
