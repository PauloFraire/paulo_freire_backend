// controllers/socialLinkController.js
import SocialLink from "../models/SocialLink.js";

// Obtener los enlaces de redes sociales
const getSocialLinks = async (req, res) => {
  try {
    const socialLinks = await SocialLink.findOne();
    res.status(200).json(socialLinks);
  } catch (error) {
    console.error("Error al obtener enlaces de redes sociales:", error);
    res
      .status(500)
      .json({ error: "Error al obtener enlaces de redes sociales" });
  }
};

// Agregar o actualizar un enlace de red social
const addOrUpdateSocialLinks = async (req, res) => {
  const { platform, url } = req.body; // 'platform' será 'facebook' o 'twitter'

  try {
    let socialLinks = await SocialLink.findOne();
    if (!socialLinks) {
      socialLinks = new SocialLink({ facebook: "", twitter: "" });
    }

    // Actualizar el enlace de la plataforma especificada
    if (platform === "facebook") {
      socialLinks.facebook = url || ""; // Permitir vacío
    } else if (platform === "twitter") {
      socialLinks.twitter = url || ""; // Permitir vacío
    }

    await socialLinks.save();
    res.status(200).json(socialLinks);
  } catch (error) {
    console.error("Error al agregar o actualizar el enlace:", error);
    res
      .status(500)
      .json({ error: "Error al agregar o actualizar enlace de red social" });
  }
};

// Eliminar un enlace de red social
const deleteSocialLink = async (req, res) => {
  const { platform } = req.params; // 'platform' será 'facebook' o 'twitter'

  try {
    let socialLinks = await SocialLink.findOne();
    if (socialLinks) {
      if (platform === "facebook") {
        socialLinks.facebook = ""; // Vaciar el enlace de Facebook
      } else if (platform === "twitter") {
        socialLinks.twitter = ""; // Vaciar el enlace de Twitter
      }

      await socialLinks.save(); // Guardar cambios en MongoDB
      res.status(200).json(socialLinks); // Devolver los enlaces actualizados
    } else {
      res.status(404).json({ error: "Enlace no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar el enlace:", error);
    res.status(500).json({ error: "Error al eliminar enlace de red social" });
  }
};

export { getSocialLinks, addOrUpdateSocialLinks, deleteSocialLink };
