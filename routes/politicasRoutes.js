//routes politicasRoutes.js
import express from "express";
import {
  getPoliticas,
  addPolitica,
  editPolitica, // Añadido
  deletePolitica, // Añadido
  setPoliticaVigente,
  getPoliticaVigente,
} from "../controllers/politicasController.js";

const router = express.Router();

router.get("/politicas", getPoliticas);
router.post("/politicas", addPolitica);
router.put("/politicas/:id", editPolitica); // Nueva ruta para editar
router.delete("/politicas/:id", deletePolitica); // Nueva ruta para eliminar
router.put("/politicas/vigente/:id", setPoliticaVigente);
router.get("/politicas/vigente", getPoliticaVigente);

export default router;
