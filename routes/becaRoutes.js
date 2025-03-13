//becaRoutes.js
import express from "express";
import multer from "multer";
import { createBeca, getBecas, getBecaById, updateBeca, deleteBeca } from "../controllers/becaController.js";

const router = express.Router();

const storage = multer.memoryStorage();

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

router.post(
  "/createbeca",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdfs", maxCount: 10 },
  ]),
  createBeca
);

router.get("/getbecas", getBecas);
router.get("/getbeca/:id", getBecaById);
router.put(
  "/updateBeca/:id", 
  upload.fields([
    { name: "image", maxCount: 1 },
     { name: "pdfs", maxCount: 10 },
    ]), 
    updateBeca);
router.delete("/deletebeca/:id", deleteBeca);

export default router;
