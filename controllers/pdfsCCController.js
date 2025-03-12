import { isValidObjectId } from "mongoose";
import PdfsCC from "../models/PdfsCC.js";
import cloudinary from "../utils/cloudinary.js";

// Helper para subir archivos a Cloudinary desde el buffer
const uploadFileFromBuffer = (file, options) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    }).end(file.buffer);
  });
};

const getPdfsCC = async (req, res) => {
  try {
    const pdfs = await PdfsCC.find();
    res.json(pdfs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPdfCCById = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Id no válido" });
  }
  try {
    const pdf = await PdfsCC.findById(id);
    if (!pdf) {
      return res.status(404).json({ message: "PDF no encontrado" });
    }
    res.json(pdf);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPdfCC = async (req, res) => {
  const { nombre, tipo, descripcion } = req.body;
  const tipoNum = Number(tipo);

  if (!nombre || !req.files?.archivo || tipo === undefined) {
    return res.status(400).json({ message: "Nombre, archivo PDF y tipo son requeridos" });
  }

  if (tipoNum !== 0 && tipoNum !== 1) {
    return res.status(400).json({ message: "Tipo debe ser 0 o 1" });
  }

  try {
    const pdfFile = req.files.archivo[0];
    const imgFile = req.files?.imagen ? req.files.imagen[0] : null;

    if (!pdfFile.mimetype.includes("pdf")) {
      return res.status(400).json({ message: "El archivo debe ser un PDF" });
    }

    const pdfResult = await uploadFileFromBuffer(pdfFile, {
      folder: "contexto-contemporaneo/pdfs",
      resource_type: "auto",
      public_id: nombre.replace(/\s+/g, "_"),
    });

    let imageResult = null;
    if (imgFile) {
      imageResult = await uploadFileFromBuffer(imgFile, {
        folder: "contexto-contemporaneo/img",
        width: 1200,
        crop: "scale",
        public_id: nombre.replace(/\s+/g, "_"),
      });
    }

    const pdf = new PdfsCC({
      nombre,
      descripcion,
      imagen: imageResult ? imageResult.secure_url : undefined,
      imagen_public_id: imageResult ? imageResult.public_id : undefined,
      archivo: pdfResult.secure_url,
      archivo_public_id: pdfResult.public_id,
      tipo: tipoNum,
    });

    await pdf.save();
    res.status(201).json(pdf);
  } catch (error) {
    res.status(500).json({ message: "Error al procesar la solicitud" });
  }
};

const updatePdfCC = async (req, res) => {
  const { id } = req.params;
  const { nombre, tipo, descripcion } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Id no válido" });
  }

  try {
    const pdf = await PdfsCC.findById(id);
    if (!pdf) {
      return res.status(404).json({ message: "PDF no encontrado" });
    }
    if (tipo !== undefined && tipo !== 0 && tipo !== 1) {
      return res.status(400).json({ message: "Tipo debe ser 0 o 1" });
    }

    if (req.files?.archivo) {
      const pdfFile = req.files.archivo[0];
      if (!pdfFile.mimetype.includes("pdf")) {
        return res.status(400).json({ message: "El archivo debe ser un PDF" });
      }

      if (pdf.archivo_public_id) {
        await cloudinary.uploader.destroy(pdf.archivo_public_id);
      }

      const pdfResult = await uploadFileFromBuffer(pdfFile, {
        folder: "contexto-contemporaneo/pdfs",
        resource_type: "auto",
        public_id: nombre.replace(/\s+/g, "_"),
      });

      pdf.archivo = pdfResult.secure_url;
      pdf.archivo_public_id = pdfResult.public_id;
    }

    if (req.files?.imagen) {
      const imgFile = req.files.imagen[0];

      if (!imgFile.mimetype.startsWith("image/")) {
        return res.status(400).json({ message: "El archivo de imagen debe ser una imagen válida" });
      }

      if (pdf.imagen_public_id) {
        await cloudinary.uploader.destroy(pdf.imagen_public_id);
      }

      const imageResult = await uploadFileFromBuffer(imgFile, {
        folder: "contexto-contemporaneo/img",
        width: 1200,
        crop: "scale",
        public_id: nombre.replace(/\s+/g, "_"),
      });

      pdf.imagen = imageResult.secure_url;
      pdf.imagen_public_id = imageResult.public_id;
    }

    pdf.nombre = nombre || pdf.nombre;
    pdf.tipo = tipo !== undefined ? tipo : pdf.tipo;

    await pdf.save();
    res.json({ message: "PDF actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el PDF" });
  }
};

const deletePdfCC = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Id no válido" });
  }
  try {
    const pdf = await PdfsCC.findById(id);
    if (!pdf) {
      return res.status(404).json({ message: "PDF no encontrado" });
    }

    if (pdf.archivo_public_id) {
      await cloudinary.v2.uploader.destroy(pdf.archivo_public_id);
    }

    if (pdf.imagen_public_id) {
      await cloudinary.v2.uploader.destroy(pdf.imagen_public_id);
    }

    await PdfsCC.findByIdAndDelete(id);
    res.json({ message: "PDF eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el PDF" });
  }
};

export {
  getPdfsCC,
  getPdfCCById,
  createPdfCC,
  updatePdfCC,
  deletePdfCC
};
