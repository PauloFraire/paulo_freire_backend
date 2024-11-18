//terminosRoutes.js
import express from "express";
import {
  getTerminos,
  addTermino,
  editTermino,
  deleteTermino,
  setTerminoVigente,
  getTerminoVigente,
} from "../controllers/terminosController.js";

const router = express.Router();

router.get("/terminos", getTerminos);
router.post("/terminos", addTermino);
router.put("/terminos/:id", editTermino);
router.delete("/terminos/:id", deleteTermino);
router.put("/terminos/vigente/:id", setTerminoVigente);
router.get("/terminos/vigente", getTerminoVigente);

export default router;
