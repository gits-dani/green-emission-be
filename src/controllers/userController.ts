import { Request, Response, NextFunction } from "express";
import passport from "../config/passport";
import { PrismaClient } from "@prisma/client";

class UserController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  register = (req: Request, res: Response, next: NextFunction) => {
    // middleware passport
    passport.authenticate(
      "local-register",
      (error: any, user: any, info: any) => {
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
      }
    )(req, res, next);
  };

  login = (req: Request, res: Response, next: NextFunction) => {
    // middleware passport
    passport.authenticate("local-login", (error: any, user: any, info: any) => {
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

  logout = (req: Request, res: Response) => {
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
}

export default new UserController();
