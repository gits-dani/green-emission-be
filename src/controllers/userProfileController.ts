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
      const { nama, no_hp, tanggal_lahir, alamat, user_id } = req.body;
      // convert ke format ISO (2023-08-27)
      const tanggal_lahir_iso = dayjs(tanggal_lahir).toISOString();

      // Cari user di database
      const user = await this.prisma.user.findUnique({
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
      const userProfile = await this.prisma.userProfile.findUnique({
        where: {
          user_id,
        },
      });

      // Buat object user profile
      const newUserProfile = {
        nama: nama || userProfile?.nama || "", // Gunakan nama default jika tidak ada data baru
        no_hp: no_hp || userProfile?.no_hp || "",
        tanggal_lahir: tanggal_lahir_iso || userProfile?.tanggal_lahir || "",
        alamat: alamat || userProfile?.alamat || "",
      };

      if (userProfile) {
        // Jika userProfile sudah ada, update data saja
        await this.prisma.userProfile.update({
          data: newUserProfile,
          where: {
            user_id,
          },
        });
      } else {
        // Jika userProfile belum ada, tambahkan data baru
        await this.prisma.userProfile.create({
          data: {
            ...newUserProfile, // Menggabungkan properti dari newUserProfile
            user: {
              connect: {
                id: user_id,
              },
            },
          },
        });
      }

      // Response sukses
      return res.status(201).json({
        status: "success",
        message: "Berhasil menambahkan user profile",
      });
    } catch (error) {
      // Tangani kesalahan
      console.error(error);
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan internal",
      });
    }
  };
}

export default new UserProfileController();
