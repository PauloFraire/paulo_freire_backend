import { isValidObjectId } from "mongoose";
import PdfsCC from "../models/PdfsCC.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

// Helper para subir archivos usando upload_stream
const uploadFileFromBuffer = (file, options) => {
  return new Promise((resolve, reject) => {
    let buffer;
    // Si el archivo ya tiene buffer, úsalo
    if (file.buffer) {
      buffer = file.buffer;
    } 
    // Sino, intenta leer el archivo desde tempFilePath
    else if (file.tempFilePath) {
      try {
        buffer = fs.readFileSync(file.tempFilePath);
      } catch (err) {
        return reject(err);
      }
    } else {
      return reject(new Error("No se encontró el buffer ni el tempFilePath del archivo"));
    }

    cloudinary.v2.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    }).end(buffer);
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
    const error = new Error('Id no válido');
    return res.status(400).json(error.message);
  }
  try {
    const pdf = await PdfsCC.findById(id);
    if (!pdf) {
      const error = new Error('PDF no encontrado');
      return res.status(404).json(error.message);
    }
    res.json(pdf);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const createPdfCC = async (req, res) => {
  const { nombre, tipo } = req.body;
  const tipoNum = Number(tipo);

  if (!nombre || !req.files?.archivo || tipo === undefined) {
    return res.status(400).json({ message: 'Nombre, archivo PDF y tipo son campos requeridos' });
  }
  
  if (tipoNum !== 0 && tipoNum !== 1) {
    return res.status(400).json({ message: 'Tipo debe ser 0 o 1' });
  }

  try {
    const pdfFile = req.files.archivo;
    const imgFile = req.files?.imagen;

    // Validar que sea un PDF
    if (!pdfFile.mimetype || !pdfFile.mimetype.includes('pdf')) {
      return res.status(400).json({ message: 'El archivo debe ser un PDF' });
    }
    if (pdfFile.size > 10 * 1024 * 1024) {
      return res.status(400).json({ message: 'El archivo no debe superar los 10MB' });
    }

    // Subir PDF a Cloudinary usando upload_stream y leyendo el buffer
    const pdfResult = await uploadFileFromBuffer(pdfFile, {
      folder: "contexto-contemporaneo/pdfs",
      resource_type: "auto",
      public_id: nombre.replace(/\s+/g, "_")
    });

    // Subir imagen si se proporciona
    let imageResult = null;
    if (imgFile) {
      if (!imgFile.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'El archivo de imagen debe ser una imagen válida' });
      }
      imageResult = await uploadFileFromBuffer(imgFile, {
        folder: "contexto-contemporaneo/img",
        width: 1200,
        crop: "scale",
        public_id: nombre.replace(/\s+/g, "_")
      });
    }

    // Crear documento en la base de datos
    const pdf = new PdfsCC({
      nombre,
      imagen: imageResult ? imageResult.secure_url : undefined,
      imagen_public_id: imageResult ? imageResult.public_id : undefined,
      archivo: pdfResult.secure_url,
      archivo_public_id: pdfResult.public_id,
      tipo: tipoNum
    });

    await pdf.save();
    res.status(201).json(pdf);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error al procesar la solicitud' });
  }
};

const updatePdfCC = async (req, res) => {
  const { id } = req.params;
  const { nombre, tipo } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Id no válido' });
  }

  try {
    const pdf = await PdfsCC.findById(id);
    if (!pdf) {
      return res.status(404).json({ message: 'PDF no encontrado' });
    }
    if (tipo !== undefined && tipo !== 0 && tipo !== 1) {
      return res.status(400).json({ message: 'Tipo debe ser 0 o 1' });
    }

    // Actualizar PDF si se envía uno nuevo
    if (req.files?.archivo) {
      const pdfFile = req.files.archivo;
      if (!pdfFile.mimetype || !pdfFile.mimetype.includes('pdf')) {
        return res.status(400).json({ message: 'El archivo debe ser un PDF' });
      }
      if (pdfFile.size > 10 * 1024 * 1024) {
        return res.status(400).json({ message: 'El archivo no debe superar los 10MB' });
      }

      if (pdf.archivo_public_id) {
        // console.log("Actualizando: Eliminando archivo anterior con public_id:", pdf.archivo_public_id);
        const destroyResult = await cloudinary.uploader.destroy(pdf.archivo_public_id);
        // console.log("Resultado eliminación de archivo anterior:", destroyResult);
      }

      const pdfResult = await uploadFileFromBuffer(pdfFile, {
        folder: "contexto-contemporaneo/pdfs",
        resource_type: "auto",
        public_id: nombre.replace(/\s+/g, "_")
      });
      
    //   console.log("PDF subido a folder contexto-contemporaneo/pdfs, public_id:", pdfResult.public_id);
      pdf.archivo = pdfResult.secure_url;
      pdf.archivo_public_id = pdfResult.public_id;
    }

    // Actualizar imagen si se envía una nueva
    if (req.files?.imagen) {
      const imgFile = req.files.imagen;
      if (!imgFile.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'El archivo de imagen debe ser una imagen válida' });
      }

      if (pdf.imagen_public_id) {
        // console.log("Actualizando: Eliminando imagen anterior con public_id:", pdf.imagen_public_id);
        const destroyResult = await cloudinary.uploader.destroy(pdf.imagen_public_id);
        // console.log("Resultado eliminación de imagen anterior:", destroyResult);
      }

      const imageResult = await uploadFileFromBuffer(imgFile, {
        folder: "contexto-contemporaneo/img",
        width: 1200,
        crop: "scale",
        public_id: nombre.replace(/\s+/g, "_")
      });
      
      pdf.imagen = imageResult.secure_url;
      pdf.imagen_public_id = imageResult.public_id;
    }

    pdf.nombre = nombre || pdf.nombre;
    pdf.tipo = tipo !== undefined ? tipo : pdf.tipo;

    await pdf.save();
    res.json({ message: 'PDF actualizado correctamente' });
  } catch (error) {
    console.log("Error al actualizar PDF:", error);
    return res.status(500).json({ message: 'Error al actualizar el PDF' });
  }
};

const deletePdfCC = async (req, res) => {
    // console.log("Inicio de deletePdfCC"); // Log de inicio de la función
    const { id } = req.params;
    if (!isValidObjectId(id)) {
    //   console.log("Id no válido:", id);
      return res.status(400).json({ message: 'Id no válido' });
    }
    try {
      const pdf = await PdfsCC.findById(id);
      if (!pdf) {
        console.log("PDF no encontrado para el id:", id);
        return res.status(404).json({ message: 'PDF no encontrado' });
      }
      console.log("PDF encontrado:", pdf);
  
      // Eliminar archivo PDF
      if (pdf.archivo_public_id) {
        // console.log("Intentando eliminar archivo con public_id:", pdf.archivo_public_id);
        const pdfDestroyResult = await cloudinary.v2.uploader.destroy(pdf.archivo_public_id);
        // console.log("Resultado de eliminación del archivo:", pdfDestroyResult);
      }
  
      // Eliminar imagen
      if (pdf.imagen_public_id) {
        // console.log("Intentando eliminar imagen con public_id:", pdf.imagen_public_id);
        const imageDestroyResult = await cloudinary.v2.uploader.destroy(pdf.imagen_public_id);
        // console.log("Resultado de eliminación de la imagen:", imageDestroyResult);
      }
  
      // Eliminar el documento de la base de datos
      await PdfsCC.findByIdAndDelete(id);
    //   console.log("PDF eliminado de la base de datos");
      res.json({ message: 'PDF eliminado correctamente' });
    } catch (error) {
    //   console.log("Error al eliminar PDF:", error);
      return res.status(500).json({ message: 'Error al eliminar el PDF' });
    }
  };  

export {
  getPdfsCC,
  getPdfCCById,
  createPdfCC,
  updatePdfCC,
  deletePdfCC
};
