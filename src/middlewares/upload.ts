import multer from "multer";

// konfigurasi upload file di memory / penyimpanan sementara
const memoryStorage = multer.memoryStorage();

const upload = multer({ storage: memoryStorage });

export { upload };
