import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import moment from "moment-timezone";
import validator from "validator";
import { modelPredict } from "../utils/modelPredict";

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
        no_hp,
        no_plat,
        engine_size,
        cylinders,
        fuel_consumption_city,
        fuel_consumption_hwy,
        fuel_consumption_comb,
        fuel_consumption_comb_mpg,
      } = req.body;
      const user_id = parseInt(req.body.user_id);

      // validasi: jika data ada yang tidak terisi
      if (
        !nama_pemilik ||
        !no_hp ||
        !no_plat ||
        !engine_size ||
        !cylinders ||
        !fuel_consumption_city ||
        !fuel_consumption_hwy ||
        !fuel_consumption_comb ||
        !fuel_consumption_comb_mpg ||
        !user_id
      ) {
        return res.status(400).json({
          status: "error",
          message:
            "Data nama_pemilik, no_hp, no_plat, engine_size, cylinders, fuel_consumption_city, fuel_consumption_hwy,fuel_consumption_comb,  fuel_consumption_comb_mpg dan user_id harus diisi",
        });
      }

      // validasi: apakah no_hp valid
      if (!validator.isMobilePhone(no_hp, "id-ID")) {
        return res.status(400).json({
          status: "error",
          message: "No Hp tidak valid",
        });
      }

      // cek user di db
      const user = await this.prisma.user.findUnique({
        where: {
          id: user_id,
        },
      });

      // validasi: jika user tidak ada
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User tidak ditemukan",
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
      const predict = await modelPredict(inputanModel);

      // validasi: jika predict bukan array
      if (!Array.isArray(predict)) {
        return res.status(400).json({
          status: "error",
          message: "Prediksi tidak valid. Harap coba lagi.",
        });
      }

      // ambil value dari prediksi
      const [emisi, status] = predict;

      // proses membuat object dari data output model untuk dimasukkan ke db
      // waktu: untuk menentukan saat melakukan prediksi
      // const waktuWIB = moment.utc().format();
      const waktuWIB = moment().locale("id").format();
      // console.log("###");
      // console.log(waktuWIB);
      // console.log("###");

      // object inputan emissionPredict db
      const newEmissionPredict = {
        nama_pemilik,
        no_hp,
        no_plat,
        ...inputanModel,
        emisi: Math.round(parseFloat(emisi) * 10) / 10,
        prediksi: status,
        waktu: waktuWIB,
        user: {
          connect: {
            id: user_id,
          },
        },
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

  getAll = async (req: Request, res: Response) => {
    try {
      // proses ambil semua data
      const emissionPredict = await this.prisma.emissionPredict.findMany({
        select: {
          id: true,
          nama_pemilik: true,
          no_hp: true,
          no_plat: true,
          engine_size: true,
          cylinders: true,
          fuel_consumption_city: true,
          fuel_consumption_hwy: true,
          fuel_consumption_comb: true,
          fuel_consumption_comb_mpg: true,
          emisi: true,
          prediksi: true,
          waktu: true,
          user: {
            select: {
              user_profile: {
                select: {
                  nama: true,
                  no_hp: true,
                  foto_profil: true,
                },
              },
            },
          },
        },
      });

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
        select: {
          id: true,
          nama_pemilik: true,
          no_hp: true,
          no_plat: true,
          engine_size: true,
          cylinders: true,
          fuel_consumption_city: true,
          fuel_consumption_hwy: true,
          fuel_consumption_comb: true,
          fuel_consumption_comb_mpg: true,
          emisi: true,
          prediksi: true,
          waktu: true,
          user: {
            select: {
              user_profile: {
                select: {
                  nama: true,
                  no_hp: true,
                  foto_profil: true,
                },
              },
            },
          },
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
      // console.log(emissionPredict);

      // validasi: jika data tidak ada
      if (!emissionPredict) {
        return res.status(404).json({
          status: "error",
          message: "Data emission predict tidak ditemukan",
        });
      }

      // ambil data dari req.body
      const {
        nama_pemilik,
        no_hp,
        no_plat,
        engine_size,
        cylinders,
        fuel_consumption_city,
        fuel_consumption_hwy,
        fuel_consumption_comb,
        fuel_consumption_comb_mpg,
      } = req.body;
      const user_id = parseInt(req.body.user_id);
      const waktuWIB = moment().locale("id").format();
      console.log("###");
      console.log(waktuWIB);
      console.log("###");

      // validasi: jika data ada yang berubah
      // membandingkan data yang dikirim oleh user dari req.body dan data emissonPredict yang ada di db
      // jika ada data inputan model seperti engine_size, cylinders dll yang dirubah maka masuk ke proses update data pertama, dan jika tidak ada data inputan model yang dirubah maka masuk ke proses update data kedua
      const isNamaPemilikChanged =
        nama_pemilik !== emissionPredict.nama_pemilik;
      const isNoPlatChanged = no_plat !== emissionPredict.no_plat;
      const isNoHpChanged = no_hp !== emissionPredict.no_hp;
      const isEngineSizeChanged =
        parseFloat(engine_size) !== emissionPredict.engine_size;
      const isCylindersChanged =
        parseFloat(cylinders) !== emissionPredict.cylinders;
      const isFuelConsumptionCityChanged =
        parseFloat(fuel_consumption_city) !==
        emissionPredict.fuel_consumption_city;
      const isFuelConsumtionHwyChanged =
        parseFloat(fuel_consumption_hwy) !==
        emissionPredict.fuel_consumption_hwy;
      const isFuelConsumptionCombChanged =
        parseFloat(fuel_consumption_comb) !==
        emissionPredict.fuel_consumption_comb;
      const isFuelConsumptionCombMpgChanged =
        parseFloat(fuel_consumption_comb_mpg) !==
        emissionPredict.fuel_consumption_comb_mpg;
      const isUserIdChanged = user_id !== emissionPredict.user_id;

      // console.log(
      //   `${isEngineSizeChanged} || ${isCylindersChanged} || ${isFuelConsumptionCityChanged} || ${isFuelConsumtionHwyChanged} || ${isFuelConsumptionCombChanged} || ${isFuelConsumptionCombMpgChanged}`
      // );

      // validasi: jika no hp diganti dan no hp tidak valid
      if (isNoHpChanged && !validator.isMobilePhone(no_hp, "id-ID")) {
        return res.status(400).json({
          status: "error",
          message: "No Hp tidak valid",
        });
      }

      // validasi: jika data inputan ke model machine learning dirubah
      if (
        isEngineSizeChanged ||
        isCylindersChanged ||
        isFuelConsumptionCityChanged ||
        isFuelConsumtionHwyChanged ||
        isFuelConsumptionCombChanged ||
        isFuelConsumptionCombMpgChanged
      ) {
        // buat object inputan model
        // melakukan pengecekan, jika data dirubah maka pakai data itu, jika tidak maka pakai data lama
        const inputanModel = {
          engine_size: isEngineSizeChanged
            ? parseFloat(engine_size)
            : emissionPredict?.engine_size || 0,
          cylinders: isCylindersChanged
            ? parseFloat(cylinders)
            : emissionPredict?.cylinders || 0,
          fuel_consumption_city: isFuelConsumptionCityChanged
            ? parseFloat(fuel_consumption_city)
            : emissionPredict?.fuel_consumption_city || 0,
          fuel_consumption_hwy: isFuelConsumtionHwyChanged
            ? parseFloat(fuel_consumption_hwy)
            : emissionPredict?.fuel_consumption_hwy || 0,
          fuel_consumption_comb: isFuelConsumptionCombChanged
            ? parseFloat(fuel_consumption_comb)
            : emissionPredict?.fuel_consumption_comb || 0,
          fuel_consumption_comb_mpg: isFuelConsumptionCombMpgChanged
            ? parseFloat(fuel_consumption_comb_mpg)
            : emissionPredict?.fuel_consumption_comb_mpg || 0,
        };

        // proses prediksi emisi
        const predict = await modelPredict(inputanModel);
        console.log(predict);

        // validaisi: jika predict bukan array
        if (!Array.isArray(predict)) {
          return res.status(400).json({
            status: "error",
            message: "Prediksi tidak valid. Harap coba lagi.",
          });
        }

        // ambil nilai dari hasil prediksi model
        const [emisi, status] = predict;

        // object emission predict baru untuk data update
        const newEmissionPredict = {
          nama_pemilik: isNamaPemilikChanged
            ? nama_pemilik
            : emissionPredict?.nama_pemilik || "",
          no_hp: isNoHpChanged ? no_hp : emissionPredict?.no_hp || "",
          no_plat: isNoPlatChanged ? no_plat : emissionPredict?.no_plat || "",
          ...inputanModel,
          emisi: Math.round(parseFloat(emisi) * 10) / 10,
          prediksi: status,
          waktu: waktuWIB,
          user: {
            connect: {
              id: isUserIdChanged ? user_id : emissionPredict.user_id,
            },
          },
        };

        // proses memasukkan data ke model machine learning dan ambil outputnya untuk update data ke db
        const updateEmissionPredict = await this.prisma.emissionPredict.update({
          where: {
            id,
          },
          data: newEmissionPredict,
        });

        // berikan response success
        return res.json({
          status: "success",
          message: "Berhasil mengedit data emission predict",
          emissionPredictId: updateEmissionPredict.id,
        });
      } else if (
        isNamaPemilikChanged ||
        isNoPlatChanged ||
        isNoHpChanged ||
        isUserIdChanged
      ) {
        // object emission predict baru untuk data update
        const newEmissionPredict = {
          nama_pemilik: isNamaPemilikChanged
            ? nama_pemilik
            : emissionPredict?.nama_pemilik || "",
          no_hp: isNoHpChanged ? no_hp : emissionPredict?.no_hp || "",
          no_plat: isNoPlatChanged ? no_plat : emissionPredict?.no_plat || "",
          user: {
            connect: {
              id: isUserIdChanged ? user_id : emissionPredict.user_id,
            },
          },
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
          message: "Berhasil mengedit data emission predict",
          emissionPredictId: updateEmissionPredict.id,
        });
      } else {
        // berikan response success
        return res.json({
          status: "success",
          message: "Berhasil mengedit data emission predict",
          emissionPredictId: emissionPredict.id,
        });
      }
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
      const emissionPredictDeleted = await this.prisma.emissionPredict.delete({
        where: {
          id,
        },
      });

      return res.json({
        status: "success",
        message: "Berhasil menghapus satu data emission predict",
        emissionPredictId: emissionPredictDeleted.id,
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
