import FormData from "form-data";
import axios from "axios";

const uploadImageToImgBB = async (fileBuffer: any, name: any) => {
  // ambil data pake form data
  const formData = new FormData();
  formData.append("key", process.env.IMGBB_API_KEY);
  formData.append("image", fileBuffer, { filename: name }); // filename itu option dari FormData

  // proses upload file gambar ke imgbb
  const imgBBResponse = await axios.post(
    "https://api.imgbb.com/1/upload",
    formData
  );

  // ambil url gambar yang berhasil terupload
  const imageUrl = imgBBResponse.data.data.url;

  // kembalikan imageUrl
  return imageUrl;
};

export { uploadImageToImgBB };
