import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

class UserProfileController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  add = async (req: Request, res: Response) => {
    try {
      // Ambil data dari req.body
      const { nama, no_hp, tanggal_lahir, alamat, user_id } = req.body;

      // Cek user di database
      const user = await this.prisma.user.findUnique({
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
      const userProfile = await this.prisma.userProfile.findUnique({
        where: {
          user_id: parseInt(user_id),
        },
      });

      // Proses pembuatan userProfile
      await this.prisma.userProfile.create({
        data: {
          nama: nama || userProfile?.nama || "", // Gunakan nilai default jika tidak ada data baru
          no_hp: no_hp || userProfile?.no_hp || "",
          tanggal_lahir: tanggal_lahir || userProfile?.tanggal_lahir || "",
          alamat: alamat || userProfile?.alamat || "",
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
    } catch (error: any) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  };
}

export default new UserProfileController();
