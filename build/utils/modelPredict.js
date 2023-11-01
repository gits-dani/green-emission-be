"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelPredict = void 0;
const python_shell_1 = require("python-shell");
const modelPredict = (inputanModel) => {
    return new Promise((resolve, reject) => {
        let options = {
            mode: "text",
            pythonOptions: ["-u"],
            scriptPath: "./src/utils",
            args: [JSON.stringify(inputanModel)],
        };
        // Menggunakan PythonShell untuk menjalankan script Python
        python_shell_1.PythonShell.run("model_loader.py", options)
            .then((result) => {
            // ambil nilai prediksi
            const emissionPredictValue = result[0];
            // validasi: grade berdasarkan nilai
            let status;
            if (emissionPredictValue > 120) {
                status = "Berbahaya";
            }
            else {
                status = "Aman";
            }
            resolve([emissionPredictValue, status]);
        })
            .catch((error) => {
            reject(error);
        });
    });
};
exports.modelPredict = modelPredict;
