import { Request, Response, NextFunction } from "express";
import passport from "../config/passport";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

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

  changePassword = async (req: Request, res: Response) => {
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
      const user = await this.prisma.user.findUnique({
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
      const { passwordLama, passwordBaru, confPasswordBaru } = req.body;

      // validasi: jika tidak mengirimkan data lengkap
      if (!passwordLama || !passwordBaru || !confPasswordBaru) {
        return res.status(400).json({
          status: "error",
          message:
            "Data passwordLama, passwordBaru, confPasswordBaru harus diisi",
        });
      }

      // cek password lama di db
      const validPasswordLama = await bcrypt.compare(
        passwordLama,
        user.password
      );

      // validasi: jika password salah / tidak sama / tidak valid
      if (!validPasswordLama) {
        return res.status(400).json({
          status: "error",
          message: "Password lama tidak valid",
        });
      }

      // validasi: compare password baru
      if (passwordBaru !== confPasswordBaru) {
        return res.status(400).json({
          status: "error",
          message: "Password baru tidak sama",
        });
      }

      // hash password baru
      const salt = await bcrypt.genSalt(10);
      const hashPasswordBaru = await bcrypt.hash(passwordBaru, salt);

      // proses update password
      const userUpdate = await this.prisma.user.update({
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
    } catch (error: any) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  };
}

export default new UserController();
