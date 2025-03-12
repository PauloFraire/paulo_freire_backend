import multer from "multer";

// Configuración de almacenamiento en memoria
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limitar tamaño a 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes("pdf") || file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Formato de archivo no permitido"), false);
    }
  },
});

export default upload;
