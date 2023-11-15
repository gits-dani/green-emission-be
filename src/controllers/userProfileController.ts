import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import validator from "validator";
import { uploadImageToImgBB } from "../utils/uploadImageToImgBB";

class UserProfileController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // tambah user profile
  // -> jika belum ada user profile berdasarkan user_id, maka buat dulu data user profilenya
  // -> jika sudah ada user profile berdasarkan user_id, maka update saja data user profilenya
  add2 = async (req: Request, res: Response) => {
    try {
      // ambil data user_id dan konversi ke number pake op unary;
      console.log(req.body);
      const user_id = +req.body.user_id;
      // console.log(user_id);

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

      // Cari userProfile berdasarkan user_id
      const userProfile = await this.prisma.userProfile.findUnique({
        where: {
          user_id,
        },
      });

      // Buat object user profile
      const newUserProfile = {
        nama: nama || userProfile?.nama || "", // Gunakan nama default jika tidak ada data baru
        no_hp: no_hp || userProfile?.no_hp || "", // ? operator chaining, cek apakah propertinya ada
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
    } catch (error: any) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  };

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

      let imageUrl;

      // validasi: jika user mengirimkan file gambar
      if (req.file) {
        // ambil data file dan isi dengan file buffernya
        const fileBuffer = req.file.buffer;

        // proses upload image ke imgbb
        imageUrl = await uploadImageToImgBB(fileBuffer, req.file.originalname);

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
      const userProfile = await this.prisma.userProfile.findUnique({
        where: {
          user_id,
        },
      });

      // Buat object user profile
      const newUserProfile = {
        nama: nama || userProfile?.nama || "", // Gunakan nama default jika tidak ada data baru
        no_hp: no_hp || userProfile?.no_hp || "", // ? operator chaining, cek apakah propertinya ada
        tanggal_lahir: tanggal_lahir_iso || userProfile?.tanggal_lahir || "",
        alamat: alamat || userProfile?.alamat || "",
        foto_profil: imageUrl || userProfile?.foto_profil || "",
      };

      // validasi: tindakan jika userProfile sudah ada / belum ada
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
    } catch (error: any) {
      // Tangani kesalahan
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      // ambil data user_id dari req.body
      const user_id = parseInt(req.params.user_id);

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

  addFotoProfil = async (req: Request, res: Response) => {
    try {
      // ambil id user
      const user_id = parseInt(req.body.user_id);
      console.log(user_id);

      // cek user berdasarkan user_id
      const user = await this.prisma.user.findUnique({
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
      const imageUrl = await uploadImageToImgBB(
        fileBuffer,
        req.file.originalname
      );

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
      const userProfile = await this.prisma.userProfile.update({
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
    } catch (error: any) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  };
}

export default new UserProfileController();
