import { PythonShell, Options } from "python-shell";
import { InputanModel } from "../interfaces/inputanModel";

const modelPredict = (inputanModel: InputanModel) => {
  // Kirim data ke script Python untuk prediksi
  let options: Options = {
    mode: "text",
    pythonOptions: ["-u"], // unbuffered stdout
    scriptPath: "./src/utils",
    args: [JSON.stringify(inputanModel)],
  };

  // Menggunakan PythonShell untuk menjalankan script Python
  PythonShell.run("model_loader.py", options).then((result) => {
    // ambil nilai prediksi
    const emissionPredictValue = result[0];

    // validasi: grade berdasarkan nilai
    let status;
    if (emissionPredictValue > 120) {
      status = "Berbahaya";
    } else {
      status = "Aman";
    }

    return [emissionPredictValue, status];
  });
};

export { modelPredict };
