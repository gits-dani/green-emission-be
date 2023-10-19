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
        tipe_kendaraan_id,
      } = req.body;

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

      // buat object inputan mode
      const inputanModel = {
        engine_size: parseFloat(engine_size),
        cylinders: parseFloat(cylinders),
        fuel_consumption_city: parseFloat(fuel_consumption_city),
        fuel_consumption_hwy: parseFloat(fuel_consumption_hwy),
        fuel_consumption_comb: parseFloat(fuel_consumption_comb),
        fuel_consumption_comb_mpg: parseFloat(fuel_consumption_comb_mpg),
      };

      // waktu: untuk menentukan saat melakukan prediksi
      const waktuWIB = moment.utc().tz("Asia/Jakarta").format();
      // object inputan emissionPredict db
      const newEmissionPredict = {
        nama_pemilik,
        no_plat,
        emisi: parseFloat("4.9"),
        prediksi: "Aman",
        waktu: waktuWIB,
        tipe_kendaraan_id,
      };

      // proses add data
      const emissionPredict = await this.prisma.emissionPredict.create({
        data: newEmissionPredict,
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
}

export default new EmissionPredictController();
