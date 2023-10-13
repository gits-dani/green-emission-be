"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageToImgBB = void 0;
const form_data_1 = __importDefault(require("form-data"));
const axios_1 = __importDefault(require("axios"));
const uploadImageToImgBB = (fileBuffer, name) => __awaiter(void 0, void 0, void 0, function* () {
    // ambil data pake form data
    const formData = new form_data_1.default();
    formData.append("key", process.env.IMGBB_API_KEY);
    formData.append("image", fileBuffer, { filename: name }); // filename itu option dari FormData
    // proses upload file gambar ke imgbb
    const imgBBResponse = yield axios_1.default.post("https://api.imgbb.com/1/upload", formData);
    // ambil url gambar yang berhasil terupload
    const imageUrl = imgBBResponse.data.data.url;
    // kembalikan imageUrl
    return imageUrl;
});
exports.uploadImageToImgBB = uploadImageToImgBB;
