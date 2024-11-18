import express from "express";
import {
  getDeslindes,
  addDeslinde,
  editDeslinde,
  deleteDeslinde,
  setDeslindeVigente,
  getDeslindeVigente,
} from "../controllers/deslindeController.js";

const router = express.Router();

router.get("/deslindes", getDeslindes);
router.post("/deslindes", addDeslinde);
router.put("/deslindes/:id", editDeslinde); // Ruta para editar
router.delete("/deslindes/:id", deleteDeslinde); // Ruta para eliminar
router.put("/deslindes/vigente/:id", setDeslindeVigente); // Establecer un deslinde como vigente
router.get("/deslindes/vigente", getDeslindeVigente); // Obtener el deslinde vigente
export default router;
