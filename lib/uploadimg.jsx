import cloudinary from "@/lib/cloudniary";

export const UploadImage = async (file, folder) => {
  const buffer = await file.arrayBuffer();
  const bytes = Buffer.from(buffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "auto",
          folder: folder,
        },
        async (error, result) => {
          if (error) {
            return reject(error.message);
          }
          return resolve(result?.secure_url);
        }
      )
      .end(bytes);
  });
};