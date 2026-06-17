import fs from "fs";
import path from "path";

const allowedExtensions = [
  ".jpg",
  ".jpeg",
  ".png"
];
//El archivo es válido o el archivo no es válido
export function validateProtectedImage(
  filename,
  imagePath
) {

  const safeFilename =
    path.basename(filename);

  const filePath =
    path.join(
      imagePath,
      safeFilename
    );
// 📌 Verificar que la imagen existe
  if (!fs.existsSync(filePath)) {

    return {
      valid: false,
      status: 404,
      message: "Image not found."
    };
  }

  const ext =
    path.extname(filename)
      .toLowerCase();

  if (
    !allowedExtensions.includes(ext)
  ) {

    return {
      valid: false,
      status: 403,
      message: "Invalid file type.",
      ext
    };
  }

  return {
    valid: true,
    filePath,
    ext
  };
}