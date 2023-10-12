import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import validator from "validator";

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
      // ambil data user_id;
      const user_id = parseInt(req.body.user_id);

      // Cari user di database
      const user = await this.prisma.user.findUnique({
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

      // Cari userProfile berdasarkan user_id
      const userProfile = await this.prisma.userProfile.findUnique({
        where: {
          user_id,
        },
      });

      // Ambil data dari req.body
      const { nama, no_hp, tanggal_lahir, alamat } = req.body;
      // convert ke format ISO (2023-08-27)
      const tanggal_lahir_iso = dayjs(tanggal_lahir).toISOString();

      // validasi: apakah no_hp valid
      if (!validator.isMobilePhone(no_hp, "id-ID")) {
        return res.status(400).json({
          status: "error",
          message: "No Hp tidak valid",
        });
      }

      // Buat object user profile
      const newUserProfile = {
        nama: nama || userProfile?.nama || "", // Gunakan nama default jika tidak ada data baru
        no_hp: no_hp || userProfile?.no_hp || "",
        tanggal_lahir: tanggal_lahir_iso || userProfile?.tanggal_lahir || "",
        alamat: alamat || userProfile?.alamat || "",
      };

      if (userProfile) {
        // Jika userProfile sudah ada, update data saja
        const updateUserProfile = await this.prisma.userProfile.update({
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
      } else {
        // Jika userProfile belum ada, tambahkan data baru
        const createUserProfile = await this.prisma.userProfile.create({
          data: {
            ...newUserProfile, // Menggabungkan properti dari newUserProfile
            user: {
              connect: {
                id: user_id,
              },
            },
          },
        });

        // Response sukses
        return res.status(201).json({
          status: "success",
          message: "Berhasil menambahkan user profile",
          userProfileId: createUserProfile.id,
        });
      }
    } catch (error) {
      // Tangani kesalahan
      console.error(error);
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan internal",
      });
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      // ambil data user_id dari req.body
      const user_id = parseInt(req.body.user_id);

      // cek user profile berdasarkan user_id
      const userProfile = await this.prisma.userProfile.findUnique({
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
    } catch (error: any) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  };
}

export default new UserProfileController();
