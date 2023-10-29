import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

class TipeKendaraanController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  add = async (req: Request, res: Response) => {
    try {
      // ambil data dari req.body
      const { tipe } = req.body;

      // validasi: jika tidak memasukkan data tipe
      if (!tipe) {
        return res.status(400).json({
          status: "error",
          message: "Data tipe harus diisi",
        });
      }

      // proses add / create data ke db
      const tipeKendaraan = await this.prisma.tipeKendaraan.create({
        data: {
          tipe,
        },
      });

      // berikan response success
      return res.status(201).json({
        status: "success",
        message: "Berhasil menambahkan tipe kendaraan",
        id: tipeKendaraan.id,
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
      const tipeKendaraan = await this.prisma.tipeKendaraan.findMany({
        select: {
          id: true,
          tipe: true,
        },
      });

      // berikan response success
      return res.json({
        status: "success",
        message: "Berhasil mengambil semua data",
        tipeKendaraan,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  };
}

export default new TipeKendaraanController();
