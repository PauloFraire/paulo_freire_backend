// controllers/becaController.js
import Beca from "../models/Beca.js";
import cloudinary from "../utils/cloudinary.js";



export const createBeca = async (req, res) => {
  try {
    const { title, description, requisitos} = req.body;
    if (!req.files || !req.files.image) {
      console.log("Archivos recibidos:", req.files);
      return res.status(400).json({ error: "Debes subir una imagen" });
    }

    const imageFile = req.files.image[0];
    const imageResult = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream(
          { folder: "becas/images", resource_type: "auto" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
      )
      .end(imageFile.buffer);
    });

    const pdfFiles = req.files.pdfs || [];
    const pdfResults = await Promise.all(
      pdfFiles.map((file) => {
        if (!file.mimetype.includes("pdf")) {
          throw new Error(
            `El archivo ${file.originalname} no es un PDF válido`
          );
        }
        // Codificar el nombre en UTF-8
        const decodedName = Buffer.from(file.originalname, "latin1").toString(
          "utf8"
        );

        return new Promise((resolve, reject) => {
          cloudinary.v2.uploader
            .upload_stream(
              {
                folder: "becas/pdfs",
                resource_type: "auto",
                public_id: decodedName
                  .normalize("NFD") // Normaliza caracteres especiales
                  .replace(/[\u0300-\u036f]/g, "") // Elimina diacríticos
                  .replace(/[^a-zA-Z0-9-_]/g, "_"), // Reemplaza caracteres no permitidos
              },
              (error, result) => {
                if (error) reject(error);
                else
                  resolve({
                    url: result.secure_url,
                    name: decodedName, // Guarda el nombre correctamente
                  });
              }
            )
            .end(file.buffer);
        });
      })
    );

    
    const newBeca = new Beca({
      imageUrl: imageResult.secure_url,
      title,
      description,
      requisitos,
      pdfs: pdfResults.map((result) => ({
        url: result.url, // URL del PDF
        name: result.name, // Nombre original del PDF
      })),
    });

    await newBeca.save();

    res.status(201).json(newBeca);
  } catch (error) {
    console.error("Error al crear la beca:", error);
    res.status(500).json({ error: "Error al crear la beca" });
  }
};

export const getBecas = async (req, res) => {
  try {
    const becas = await Beca.find();
    res.status(200).json(becas);
  } catch (error) {
    console.error("Error al obtener las becas:", error);
    res.status(500).json({ error: "Error al obtener las becas" });
  }
};

export const getBecaById = async (req, res) => {
  try {
    const { id } = req.params;
    const beca = await Beca.findById(id);
    if (!beca) {
      return res.status(404).json({ error: "Beca no encontrada" });
    }
    res.json(beca);
  } catch (error) {
    console.error("Error al obtener la beca:", error);
    res.status(500).json({ error: "Error al obtener la beca" });
  }
};

export const updateBeca = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, requisitos} = req.body;
    

    const beca = await Beca.findById(id);
    if (!beca) {
      return res.status(404).json({ error: "Beca no encontrada" });
    }

    // Manejo de imagen (opcional)
    if (req.files && req.files.image) {
      // Eliminar imagen anterior de Cloudinary
      const publicId = beca.imageUrl.split("/").pop().split(".")[0]; // Extraer el public_id
      await cloudinary.v2.uploader.destroy(
        `becas/images/${publicId}`
      );

      // Subir la nueva imagen a Cloudinary
      const imageFile = req.files.image[0];
      const imageResult = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream(
            { folder: "becas/images", resource_type: "auto" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(imageFile.buffer);
      });

      beca.imageUrl = imageResult.secure_url;
    }

    // Manejo de PDFs (opcional)
    if (req.files && req.files.pdfs) {
      // Eliminar PDFs anteriores de Cloudinary
      for (const pdf of beca.pdfs) {
        const publicId = pdf.url.split("/").pop().split(".")[0]; // Extraer el public_id
        await cloudinary.v2.uploader.destroy(
          `becas/pdfs/${publicId}`
        );
      }

      // Subir los nuevos PDFs
      const pdfFiles = req.files.pdfs;
      const pdfResults = await Promise.all(
        pdfFiles.map((file) => {
          if (!file.mimetype.includes("pdf")) {
            throw new Error(
              `El archivo ${file.originalname} no es un PDF válido`
            );
          }

          const decodedName = Buffer.from(file.originalname, "latin1").toString(
            "utf8"
          );

          return new Promise((resolve, reject) => {
            cloudinary.v2.uploader
              .upload_stream(
                {
                  folder: "becas/pdfs",
                  resource_type: "auto",
                  public_id: decodedName
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-zA-Z0-9-_]/g, "_"),
                },
                (error, result) => {
                  if (error) reject(error);
                  else resolve({ url: result.secure_url, name: decodedName });
                }
              )
              .end(file.buffer);
          });
        })
      );

      beca.pdfs = pdfResults.map((result) => ({
        url: result.url,
        name: result.name,
      }));
    }

    // Actualizar los datos de la beca
    beca.title = title || beca.title;
    beca.description = description || beca.description;
    beca.requisitos = requisitos || beca.requisitos;

    await beca.save();

    res.status(200).json(beca);
  } catch (error) {
    console.error("Error al actualizar la beca:", error);
    res.status(500).json({ error: "Error al actualizar la beca" });
  }
};

export const deleteBeca = async (req, res) => {
  try {
    const { id } = req.params;
    const beca = await Beca.findById(id);
    if (!beca) {
      return res.status(404).json({ error: "Beca no encontrada" });
    }

    // Eliminar la imagen de Cloudinary
        if (beca.imageUrl) {
          const publicId = beca.imageUrl.split("/").pop().split(".")[0]; // Extraer el public_id
          await cloudinary.v2.uploader.destroy(
            `becas/images/${publicId}`
          );
        }
    
        // Eliminar los PDFs de Cloudinary
        if (beca.pdfs && beca.pdfs.length > 0) {
          for (const pdf of beca.pdfs) {
            const publicId = pdf.url.split("/").pop().split(".")[0]; // Extraer el public_id
            await cloudinary.v2.uploader.destroy(
              `becas/pdfs/${publicId}`
            );
          }
        }
    
    await Beca.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Beca eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la beca:", error);
    res.status(500).json({ error: "Error al eliminar la beca" });
  }
};