import express from "express";
import multer from "multer";
import {
  createEducationalOffer,
  getEducationalOffers,
  getEducationalOfferById,
  updateEducationalOffer,
  deleteEducationalOffer,
} from "../controllers/ofertaEducativaController.js";

const router = express.Router();

// Configuración de Multer para manejar múltiples archivos
const storage = multer.memoryStorage(); // Almacenar archivos en memoria
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite de 5 MB por archivo
  },
  fileFilter: (req, file, cb) => {
    // Validar tipos de archivo
    if (file.fieldname === "image") {
      // Solo permitir imágenes (JPEG, PNG)
      if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
      } else {
        cb(new Error("El archivo debe ser una imagen (JPEG o PNG)"), false);
      }
    } else if (file.fieldname === "pdfs") {
      // Solo permitir PDFs
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new Error("El archivo debe ser un PDF"), false);
      }
    } else {
      cb(new Error("Campo de archivo no válido"), false);
    }
  },
});

// Ruta para crear una oferta educativa
router.post(
  "/createoffter",
  upload.fields([
    { name: "image", maxCount: 1 }, // Un solo archivo para la imagen
    { name: "pdfs", maxCount: 10 }, // Hasta 10 archivos para los PDFs
  ]),
  createEducationalOffer
);

// Ruta para obtener todas las ofertas educativas
router.get("/getoffter", getEducationalOffers);

// Ruta para obtener una oferta educativa por su ID
router.get("/getoffterid/:id", getEducationalOfferById);

// Ruta para actualizar una oferta educativa por su ID
router.put(
  "/updateEducationalOffer/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdfs", maxCount: 10 },
  ]),
  updateEducationalOffer
);

// Ruta para eliminar una oferta educativa por su ID
router.delete("/offterdelete/:id", deleteEducationalOffer);
export default router;
