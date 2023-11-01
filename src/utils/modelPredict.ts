import { PythonShell, Options } from "python-shell";
import { InputanModel } from "../interfaces/inputanModel";

const modelPredict = (inputanModel: InputanModel) => {
  return new Promise((resolve, reject) => {
    let options: Options = {
      mode: "text",
      pythonOptions: ["-u"], // unbuffered stdout
      scriptPath: "./src/utils",
      args: [JSON.stringify(inputanModel)],
    };

    // Menggunakan PythonShell untuk menjalankan script Python
    PythonShell.run("model_loader.py", options)
      .then((result) => {
        // ambil nilai prediksi
        const emissionPredictValue = result[0];

        // validasi: grade berdasarkan nilai
        let status;
        if (emissionPredictValue > 120) {
          status = "Berbahaya";
        } else {
          status = "Aman";
        }

        resolve([emissionPredictValue, status]);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export { modelPredict };
