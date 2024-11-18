// routes/socialLinkRoutes.js
import express from "express";
import {
  getSocialLinks,
  addOrUpdateSocialLinks,
  deleteSocialLink,
} from "../controllers/socialLinkController.js";

const router = express.Router();

// Ruta para obtener los enlaces de redes sociales
router.get("/social-links", getSocialLinks);

// Ruta para agregar o actualizar enlaces de redes sociales
router.put("/social-links", addOrUpdateSocialLinks);

// Ruta para eliminar un enlace de red social
router.delete("/social-links/:platform", deleteSocialLink);

export default router;
