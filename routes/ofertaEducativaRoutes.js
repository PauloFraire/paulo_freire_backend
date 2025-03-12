import express from "express";
import upload from "../utils/multerConfig.js";
import {
  createEducationalOffer,
  getEducationalOffers,
  getEducationalOfferById,
  updateEducationalOffer,
  deleteEducationalOffer,
} from "../controllers/ofertaEducativaController.js";

const router = express.Router();

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
