import Logo from "../models/Logo.js";
import cloudinary from "../utils/cloudinary.js";

// Subir o actualizar logo
export const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No se ha proporcionado un archivo" });
    }

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: "El archivo debe ser JPEG o PNG" });
    }

    if (req.file.size > 2 * 1024 * 1024) {
      // 2 MB
      return res
        .status(400)
        .json({ error: "El archivo no debe exceder los 2 MB" });
    }

    // Buscar logo existente
    let logo = await Logo.findOne();
    if (logo) {
      // Extraer publicId del logo actual y eliminarlo de Cloudinary
      const publicId = logo.url.split("/").pop().split(".")[0];
      await cloudinary.v2.uploader.destroy(`uploads/${publicId}`);
    }

    // Subir nuevo logo
    const result = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream(
          { folder: "uploads", use_filename: true, unique_filename: false },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(req.file.buffer);
    });

    // Guardar nuevo logo en la base de datos
    if (logo) {
      logo.url = result.secure_url;
    } else {
      logo = new Logo({ url: result.secure_url });
    }
    await logo.save();

    res.status(200).json({
      message: "Logo actualizado correctamente",
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Error al actualizar el logo:", error);
    res.status(500).json({ error: "Error al actualizar el logo" });
  }
};

// Eliminar logo
export const deleteLogo = async (req, res) => {
  try {
    const logo = await Logo.findOne();
    if (!logo) {
      return res.status(404).json({ error: "Logo no encontrado" });
    }

    // Extraer publicId y eliminar de Cloudinary
    const publicId = logo.url.split("/").pop().split(".")[0];
    await cloudinary.v2.uploader.destroy(`uploads/${publicId}`);

    // Eliminar logo de la base de datos
    await Logo.deleteOne({ _id: logo._id });

    res.status(200).json({ message: "Logo eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el logo:", error);
    res.status(500).json({ error: "Error al eliminar el logo" });
  }
};

// Obtener logo
export const getLogo = async (req, res) => {
  try {
    const logo = await Logo.findOne();
    if (!logo) {
      return res.status(404).json({ error: "No hay logo registrado" });
    }
    res.status(200).json({ url: logo.url });
  } catch (error) {
    console.error("Error al obtener el logo:", error);
    res.status(500).json({ error: "Error al obtener el logo" });
  }
};
