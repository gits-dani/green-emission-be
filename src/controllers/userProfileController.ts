import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

class UserProfileController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // tambah user profile
  // -> jika belum ada user profile berdasarkan user_id, maka buat dulu data user profilenya
  // -> jika sudah ada user profile berdasarkan user_id, maka update saja data user profilenya
  add = async (req: Request, res: Response) => {
    try {
      // Ambil data dari req.body
      const { nama, no_hp, tanggal_lahir, alamat } = req.body;
      const user_id = parseInt(req.body.user_id);
      const tanggal_lahir_iso = dayjs(tanggal_lahir).toISOString();

      // Cari userProfile berdasarkan user_id
      const userProfile = await this.prisma.userProfile.findUnique({
        where: {
          id: user_id,
        },
      });

      // buat object user profile
      const newUserProfile = {
        nama: nama || userProfile?.nama || "", // kalau nama ada pake nama, sisanya ga di pake
        no_hp: no_hp || userProfile?.no_hp || "",
        tanggal_lahir: tanggal_lahir_iso || userProfile?.tanggal_lahir || "",
        alamat: alamat || userProfile?.alamat || "",
        user: {
          connect: {
            id: user_id, // menghubungkan dengan tabel user
          },
        },
      };

      // validasi: jika user profile belum ada maka tambah data
      if (!userProfile) {
        await this.prisma.userProfile.create({
          data: newUserProfile,
        });
      }

      // jika user profile sudah ada maka update data saja
      await this.prisma.userProfile.update({
        data: newUserProfile,
        where: {
          id: user_id,
        },
      });

      // Response sukses
      return res.status(201).json({
        status: "success",
        message: "Berhasil menambahkan user profile",
      });
    } catch (error: any) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  };
}

export default new UserProfileController();
