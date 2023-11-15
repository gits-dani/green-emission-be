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
const passport_1 = __importDefault(require("../config/passport"));
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserController {
    constructor() {
        this.register = (req, res, next) => {
            // middleware passport
            passport_1.default.authenticate("local-register", (error, user, info) => {
                // validasi: jika error
                // error => data error
                if (error) {
                    return res.status(500).json({
                        status: "error",
                        message: error.message,
                    });
                }
                // validasi: jika user tidak berhasil register
                // user => data user yang berhasil register
                if (!user) {
                    // pesan kesalahan / informasi tambahan ketika otentikasi
                    if (info) {
                        return res.status(401).json({
                            status: "error",
                            message: info.message,
                        });
                    }
                }
                // response success
                return res.status(201).json({
                    status: "success",
                    message: "Registrasi berhasil",
                    userId: user.id,
                });
            })(req, res, next);
        };
        this.login = (req, res, next) => {
            // middleware passport
            passport_1.default.authenticate("local-login", (error, user, info) => {
                // validasi: jika error
                // error => data error
                if (error) {
                    return res.status(500).json({
                        status: "error",
                        message: error.message,
                    });
                }
                // validasi: jika user tidak berhasil login
                // user => data user yang berhasil login
                if (!user) {
                    // pesan kesalahan / informasi tambahan ketika otentikasi
                    if (info) {
                        return res.status(401).json({
                            status: "error",
                            message: info.message,
                        });
                    }
                }
                // strategi otektikasi berbasis sesi
                // req.login() = method passport yg digunakan untuk menyimpan data user ketika berhasil login
                req.login(user, (error) => {
                    // validasi: jika error
                    if (error) {
                        return res.status(500).json({
                            status: "error",
                            message: error.message,
                        });
                    }
                    // response success
                    return res.json({
                        status: "success",
                        message: "Login berhasil",
                        userId: user.id,
                    });
                });
            })(req, res, next);
        };
        this.logout = (req, res) => {
            req.logout((error) => {
                // validas: jika error
                if (error) {
                    return res.status(500).json({
                        status: "error",
                        message: error.message,
                    });
                }
                // response success
                return res.json({ status: "success", message: "Logout berhasil" });
            });
        };
        this.changePassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // ambil id user
                const id = parseInt(req.body.id);
                // validasi: jika tidak mengirimkan id
                if (!id) {
                    return res.status(400).json({
                        status: "error",
                        message: "Data id harus diisi",
                    });
                }
                // cek user berdasarkan id
                const user = yield this.prisma.user.findUnique({
                    where: {
                        id,
                    },
                });
                // validasi: jika user tidak ada
                if (!user) {
                    return res.status(404).json({
                        status: "error",
                        message: "User tidak ditemukan",
                    });
                }
                // ambil data password
                const { passwordLama, passwordBaru, confirmPasswordBaru } = req.body;
                // validasi: jika tidak mengirimkan data lengkap
                if (!passwordLama || !passwordBaru || !confirmPasswordBaru) {
                    return res.status(400).json({
                        status: "error",
                        message: "Data passwordLama, passwordBaru, confirmPasswordBaru harus diisi",
                    });
                }
                // cek password lama di db
                const validPasswordLama = yield bcrypt_1.default.compare(passwordLama, user.password);
                // validasi: jika password salah / tidak sama / tidak valid
                if (!validPasswordLama) {
                    return res.status(400).json({
                        status: "error",
                        message: "Password lama tidak valid",
                    });
                }
                // validasi: compare password baru
                if (passwordBaru !== confirmPasswordBaru) {
                    return res.status(400).json({
                        status: "error",
                        message: "Password baru tidak sama",
                    });
                }
                // hash password baru
                const salt = yield bcrypt_1.default.genSalt(10);
                const hashPasswordBaru = yield bcrypt_1.default.hash(passwordBaru, salt);
                // proses update password
                const userUpdate = yield this.prisma.user.update({
                    data: {
                        password: hashPasswordBaru,
                    },
                    where: {
                        id,
                    },
                });
                // berikan response success
                return res.json({
                    status: "success",
                    message: "Password berhasil diganti",
                    userId: userUpdate.id,
                });
            }
            catch (error) {
                return res.status(500).json({ status: "error", message: error.message });
            }
        });
        this.prisma = new client_1.PrismaClient();
    }
}
exports.default = new UserController();
