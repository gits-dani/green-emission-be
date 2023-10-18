import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

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
        tipe_kendaraan,
        engine_size,
        cylinders,
        fuel_consumption_city,
        fuel_consumption_hwy,
        fuel_consumption_comb,
        fuel_consumption_comb_mpg,
      } = req.body;

      // validasi: jika data ada yang tidak terisi
      if (
        !nama_pemilik ||
        !no_plat ||
        !tipe_kendaraan ||
        !engine_size ||
        !cylinders ||
        !fuel_consumption_city ||
        !fuel_consumption_hwy ||
        !fuel_consumption_comb ||
        !fuel_consumption_comb_mpg
      ) {
        return res.status(400).json({
          status: "error",
          message:
            "Data nama_pemilik, no_plat tipe_kendaraan, engine_size, cylinders, fuel_consumption_city, fuel_consumption_hwy,fuel_consumption_comb dan fuel_consumption_comb_mpg harus diisi",
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

      const newEmissionPredict = {
        nama_pemilik,
        no_plat,
        tipe_kendaraan,
        emisi: parseFloat("4"),
        prediksi: "Aman",
      };

      // proses add data
      const emissionPredict = await this.prisma.emissionPredict.create({
        data: newEmissionPredict,
      });

      // berikan response success
      return res.status(201).json({
        status: "success",
        message: "Berhasil prediksi emissi",
        emissionPredict,
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
