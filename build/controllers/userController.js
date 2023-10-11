"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("../config/passport"));
const client_1 = require("@prisma/client");
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
                    return res.status(500).json({
                        status: "error",
                        message: "User sudah ada",
                    });
                }
                // response success
                return res.status(201).json({
                    status: "success",
                    message: "Registrasi berhasil",
                    user,
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
                        user,
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
        this.prisma = new client_1.PrismaClient();
    }
}
exports.default = new UserController();
