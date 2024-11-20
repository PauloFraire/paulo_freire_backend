import express from "express";
import {
  getSlogan,
  updateSlogan,
  deleteSlogan,
} from "../controllers/sloganController.js";

const router = express.Router();

// Ruta para obtener el eslogan
router.get("/slogan", getSlogan);

// Ruta para agregar o actualizar el eslogan
router.put("/slogan", updateSlogan);

// Ruta para eliminar el eslogan
router.delete("/slogan", deleteSlogan);

export default router;
