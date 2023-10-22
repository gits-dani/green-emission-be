import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import moment from "moment-timezone";

class EmissionPredictController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  add = async (req: Request, res: Response) => {
    try {
      // ambil data dari req.body
      const {
        nama_pemilik,
        no_plat,
        engine_size,
        cylinders,
        fuel_consumption_city,
        fuel_consumption_hwy,
        fuel_consumption_comb,
        fuel_consumption_comb_mpg,
      } = req.body;
      const tipe_kendaraan_id = parseInt(req.body.tipe_kendaraan_id);

      // validasi: jika data ada yang tidak terisi
      if (
        !nama_pemilik ||
        !no_plat ||
        !engine_size ||
        !cylinders ||
        !fuel_consumption_city ||
        !fuel_consumption_hwy ||
        !fuel_consumption_comb ||
        !fuel_consumption_comb_mpg ||
        !tipe_kendaraan_id
      ) {
        return res.status(400).json({
          status: "error",
          message:
            "Data nama_pemilik, no_plat tipe_kendaraan, engine_size, cylinders, fuel_consumption_city, fuel_consumption_hwy,fuel_consumption_comb dan fuel_consumption_comb_mpg harus diisi",
        });
      }

      // cek tipe kendaraan di db
      const tipe_kendaraan = await this.prisma.tipeKendaraan.findUnique({
        where: {
          id: tipe_kendaraan_id,
        },
      });

      // validasi: jika tipe kendaraan tidak ditemukan
      if (!tipe_kendaraan) {
        return res.status(404).json({
          status: "error",
          message: "Tipe kendaraan tidak ditemukan",
        });
      }

      // buat object inputan mode
      const inputanModel = {
        engine_size: parseFloat(engine_size),
        cylinders: parseFloat(cylinders),
        fuel_consumption_city: parseFloat(fuel_consumption_city),
        fuel_consumption_hwy: parseFloat(fuel_consumption_hwy),
        fuel_consumption_comb: parseFloat(fuel_consumption_comb),
        fuel_consumption_comb_mpg: parseFloat(fuel_consumption_comb_mpg),
      };

      // proses input ke model

      // proses membuat object dari data output model untuk dimasukkan ke db
      // waktu: untuk menentukan saat melakukan prediksi
      const waktuWIB = moment.utc().tz("Asia/Jakarta").format();
      // object inputan emissionPredict db
      const newEmissionPredict = {
        nama_pemilik,
        no_plat,
        ...inputanModel,
        emisi: parseFloat("4.9"),
        prediksi: "Aman",
        waktu: waktuWIB,
      };

      // proses add data
      const emissionPredict = await this.prisma.emissionPredict.create({
        data: {
          ...newEmissionPredict,
          tipe_kendaraan: {
            connect: {
              id: tipe_kendaraan_id,
            },
          },
        },
      });

      // berikan response success
      return res.status(201).json({
        status: "success",
        message: "Berhasil prediksi emissi",
        emissionPredictId: emissionPredict.id,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      // proses ambil semua data
      const emissionPredict = await this.prisma.emissionPredict.findMany();

      // berikan response success
      return res.json({
        status: "success",
        message: "Berhasil mengambil semua data",
        emissionPredict,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  };

  getOne = async (req: Request, res: Response) => {
    try {
      // ambil id dari req.params.id
      const id = parseInt(req.params.id);

      // cek id di database
      const emissionPredict = await this.prisma.emissionPredict.findUnique({
        where: {
          id,
        },
      });

      // validasi: jika data emission predict tidak ada
      if (!emissionPredict) {
        return res.status(404).json({
          status: "error",
          message: "Data emission predict tidak ditemukan",
        });
      }

      // berikan response success
      return res.json({
        status: "success",
        message: "Berhasil mengambil satu data emission predict",
        emissionPredict,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  };

  edit = async (req: Request, res: Response) => {
    try {
      // ambil id dari req.params.id
      const id = parseInt(req.params.id);

      // cek data di db
      const emissionPredict = await this.prisma.emissionPredict.findUnique({
        where: {
          id,
        },
      });

      // validasi: jika data tidak ada
      if (!emissionPredict) {
        return res.status(404).json({
          status: "error",
          message: "Data emission predict tidak ditemukan",
        });
      }

      // ambil data dari body
      const {
        nama_pemilik,
        no_plat,
        engine_size,
        cylinders,
        fuel_consumption_city,
        fuel_consumption_hwy,
        fuel_consumption_comb,
        fuel_consumption_comb_mpg,
        tipe_kendaraan_id,
      } = req.body;

      const waktuWIB = moment.utc().tz("Asia/Jakarta").format();
      // buat object emissionPredict
      const newEmissionPredict = {
        nama_pemilik: nama_pemilik || emissionPredict?.nama_pemilik || "",
        no_plat: no_plat || emissionPredict?.no_plat || "",
        engine_size: engine_size || emissionPredict?.engine_size || "",
        cylinders: cylinders || emissionPredict?.cylinders || "",
        fuel_consumption_city:
          fuel_consumption_city || emissionPredict?.fuel_consumption_city || "",
        fuel_consumption_hwy:
          fuel_consumption_hwy || emissionPredict?.fuel_consumption_hwy || "",
        fuel_consumption_comb:
          fuel_consumption_comb || emissionPredict?.fuel_consumption_comb || "",
        fuel_consumption_comb_mpg:
          fuel_consumption_comb_mpg ||
          emissionPredict?.fuel_consumption_comb_mpg ||
          "",
        emisi: 4.9,
        prediksi: "Aman Update",
        waktu: waktuWIB,
        tipe_kendaraan_id:
          tipe_kendaraan_id || emissionPredict?.tipe_kendaraan_id || "",
      };

      // proses update data
      const updateEmissionPredict = await this.prisma.emissionPredict.update({
        where: {
          id,
        },
        data: newEmissionPredict,
      });

      // berikan response success
      return res.json({
        status: "success",
        message: "Berhasil mengedit data",
        emissionPredictId: updateEmissionPredict.id,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      // ambil id dari req.params.id
      const id = parseInt(req.params.id);

      // cek id di database
      const emissionPredict = await this.prisma.emissionPredict.findUnique({
        where: {
          id,
        },
      });

      // validasi: jika data emisison predict tidak ditemukan
      if (!emissionPredict) {
        return res.status(404).json({
          status: "error",
          message: "Data emission predict tidak ditemukan",
        });
      }

      // proses hapus data
      await this.prisma.emissionPredict.delete({
        where: {
          id,
        },
      });

      return res.json({
        status: "success",
        message: "Berhasil menghapus satu data emission predict",
      });
    } catch (error: any) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  };
}

export default new EmissionPredictController();
