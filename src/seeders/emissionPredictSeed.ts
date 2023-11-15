import { PrismaClient, User } from "@prisma/client";
import fs from "fs";
import path from "path";

interface EmissionPredictData {
  nama_pemilik: string;
  no_hp: string;
  no_plat: string;
  engine_size: number;
  cylinders: number;
  fuel_consumption_city: number;
  fuel_consumption_hwy: number;
  fuel_consumption_comb: number;
  fuel_consumption_comb_mpg: number;
  emisi: number;
  prediksi: string;
  waktu: Date;
  user_id: number;
}

const prisma = new PrismaClient();

const main = async () => {
  try {
    // Baca data dari file JSON
    const dataFilePath = path.resolve(__dirname, "emissionPredictData.json");
    const rawData = fs.readFileSync(dataFilePath, "utf-8");
    const jsonData: EmissionPredictData[] = JSON.parse(rawData);

    // Masukkan data EmissionPredict ke dalam database
    await prisma.emissionPredict.createMany({
      data: jsonData.map((data) => ({ ...data })),
    });

    console.log("Seeder selesai");
  } catch (error) {
    console.error("Seeder gagal:", error);
  } finally {
    await prisma.$disconnect();
  }
};

main();
