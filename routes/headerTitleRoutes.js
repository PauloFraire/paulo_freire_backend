import express from "express";
import {
  getHeaderTitle,
  addOrUpdateHeaderTitle,
  deleteHeaderTitle,
} from "../controllers/headerTitleController.js";

const router = express.Router();

// Ruta para obtener el título
router.get("/header-title", getHeaderTitle);

// Ruta para agregar o actualizar el título
router.put("/header-title", addOrUpdateHeaderTitle);

// Ruta para eliminar el título
router.delete("/header-title", deleteHeaderTitle);

export default router;
