import express from "express";
import {
  getPdfsCC,
  getPdfCCById,
  createPdfCC,
  updatePdfCC,
  deletePdfCC,
} from "../controllers/pdfsCCController.js";
import { checkAuth, isAdmin } from "../middleware/checkAuth.js";
import upload from "../utils/multerConfig.js";

const router = express.Router();

router.get("/pdfs-cc", getPdfsCC);
router.get("/pdfs-cc/:id", getPdfCCById);
router.post("/pdfs-cc", checkAuth, isAdmin, upload.fields([{ name: "archivo" }, { name: "imagen" }]), createPdfCC);
router.put("/pdfs-cc/:id", checkAuth, isAdmin, upload.fields([{ name: "archivo" }, { name: "imagen" }]), updatePdfCC);
router.delete("/pdfs-cc/:id", checkAuth, isAdmin, deletePdfCC);

export default router;
