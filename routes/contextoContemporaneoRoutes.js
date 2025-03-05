import express from "express";
import {
    obtenerContextos,
    nuevoContexto,
    obtenerContexto,
    actualizarContexto,
    eliminarContexto
} from "../controllers/contextoContemporaneoController.js";
import { checkAuth, isAdmin } from '../middleware/checkAuth.js';

const router = express.Router();

router.route("/contexto-contemporaneo")
    .get(obtenerContextos)
    .post(checkAuth, isAdmin, nuevoContexto);

router.route("/contexto-contemporaneo/:id")
    .get(obtenerContexto)
    .put(checkAuth, isAdmin, actualizarContexto)
    .delete(checkAuth, isAdmin, eliminarContexto);

export default router;