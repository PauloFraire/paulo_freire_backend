//controllers/ofertaEducativaController.js
import EducationalOffer from "../models/OfertaEducativa.js";
import cloudinary from "../utils/cloudinary.js";

//---------------------------------------------------------------funcional
export const createEducationalOffer = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validar que se haya subido una imagen
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "Debes subir una imagen" });
    }

    // Subir la imagen a Cloudinary
    const imageFile = req.files.image[0];
    const imageResult = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream(
          { folder: "educational-offers/images", resource_type: "auto" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(imageFile.buffer);
    });

    // Subir los PDFs a Cloudinary
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
                folder: "educational-offers/pdfs",
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

    // Crear la oferta educativa en la base de datos
    const newOffer = new EducationalOffer({
      imageUrl: imageResult.secure_url, // URL de la imagen
      title,
      description,
      pdfs: pdfResults.map((result) => ({
        url: result.url, // URL del PDF
        name: result.name, // Nombre original del PDF
      })),
    });

    await newOffer.save();

    res.status(201).json(newOffer);
  } catch (error) {
    console.error("Error al crear la oferta educativa:", error);
    res.status(500).json({ error: "Error al crear la oferta educativa" });
  }
};
// Obtener todas las ofertas educativas--------------------------funcional
export const getEducationalOffers = async (req, res) => {
  try {
    const offers = await EducationalOffer.find(); // Obtener todas las ofertas
    res.status(200).json(offers); // Enviar las ofertas como respuesta
  } catch (error) {
    console.error("Error al obtener las ofertas educativas:", error);
    res.status(500).json({ error: "Error al obtener las ofertas educativas" });
  }
};
// Editar una oferta educativa-----------------------------------funcional
export const updateEducationalOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // Buscar la oferta en la base de datos
    const offer = await EducationalOffer.findById(id);
    if (!offer) {
      return res.status(404).json({ error: "Oferta educativa no encontrada" });
    }

    // Manejo de imagen (opcional)
    if (req.files && req.files.image) {
      // Eliminar imagen anterior de Cloudinary
      const publicId = offer.imageUrl.split("/").pop().split(".")[0]; // Extraer el public_id
      await cloudinary.v2.uploader.destroy(
        `educational-offers/images/${publicId}`
      );

      // Subir la nueva imagen a Cloudinary
      const imageFile = req.files.image[0];
      const imageResult = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream(
            { folder: "educational-offers/images", resource_type: "auto" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(imageFile.buffer);
      });

      offer.imageUrl = imageResult.secure_url;
    }

    // Manejo de PDFs (opcional)
    if (req.files && req.files.pdfs) {
      // Eliminar PDFs anteriores de Cloudinary
      for (const pdf of offer.pdfs) {
        const publicId = pdf.url.split("/").pop().split(".")[0]; // Extraer el public_id
        await cloudinary.v2.uploader.destroy(
          `educational-offers/pdfs/${publicId}`
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
                  folder: "educational-offers/pdfs",
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

      offer.pdfs = pdfResults.map((result) => ({
        url: result.url,
        name: result.name,
      }));
    }

    // Actualizar los datos de la oferta
    offer.title = title || offer.title;
    offer.description = description || offer.description;

    await offer.save();

    res.status(200).json(offer);
  } catch (error) {
    console.error("Error al actualizar la oferta educativa:", error);
    res.status(500).json({ error: "Error al actualizar la oferta educativa" });
  }
};

// Eliminar una oferta educativa---------------------------------funcional
export const deleteEducationalOffer = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar la oferta en la base de datos
    const offer = await EducationalOffer.findById(id);
    if (!offer) {
      return res.status(404).json({ error: "Oferta educativa no encontrada" });
    }

    // Eliminar la imagen de Cloudinary
    if (offer.imageUrl) {
      const publicId = offer.imageUrl.split("/").pop().split(".")[0]; // Extraer el public_id
      await cloudinary.v2.uploader.destroy(
        `educational-offers/images/${publicId}`
      );
    }

    // Eliminar los PDFs de Cloudinary
    if (offer.pdfs && offer.pdfs.length > 0) {
      for (const pdf of offer.pdfs) {
        const publicId = pdf.url.split("/").pop().split(".")[0]; // Extraer el public_id
        await cloudinary.v2.uploader.destroy(
          `educational-offers/pdfs/${publicId}`
        );
      }
    }

    // Eliminar la oferta de la base de datos
    await EducationalOffer.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "Oferta educativa eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la oferta educativa:", error);
    res.status(500).json({ error: "Error al eliminar la oferta educativa" });
  }
};
