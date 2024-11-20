import Slogan from "../models/Slogan.js";

// Obtener el eslogan
const getSlogan = async (req, res) => {
  try {
    const slogan = await Slogan.findOne();
    res.status(200).json(slogan || { text: "Bienvenido al sitio!" });
  } catch (error) {
    console.error("Error al obtener el eslogan:", error);
    res.status(500).json({ error: "Error al obtener el eslogan" });
  }
};

// Agregar o actualizar un eslogan
const updateSlogan = async (req, res) => {
  const { text } = req.body;

  if (text.length > 100) {
    return res
      .status(400)
      .json({ error: "El eslogan no puede exceder 100 caracteres" });
  }

  try {
    let slogan = await Slogan.findOne();
    if (!slogan) {
      // Si no existe un eslogan, lo creamos
      slogan = new Slogan({ text });
      await slogan.save();
      return res.status(201).json(slogan); // Respuesta de "creado"
    } else {
      // Si ya existe, lo actualizamos
      slogan.text = text;
      await slogan.save();
      return res.status(200).json(slogan); // Respuesta de "actualizado"
    }
  } catch (error) {
    console.error("Error al actualizar el eslogan:", error);
    res.status(500).json({ error: "Error al actualizar el eslogan" });
  }
};

// Eliminar el eslogan
const deleteSlogan = async (req, res) => {
  try {
    const slogan = await Slogan.findOne(); // Buscar el primer eslogan
    if (!slogan) {
      return res
        .status(404)
        .json({ error: "No se encuentra un eslogan para eliminar" });
    }

    // Eliminamos el eslogan
    await Slogan.deleteOne({ _id: slogan._id });

    res.status(200).json({ message: "Eslogan eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el eslogan:", error);
    res.status(500).json({ error: "Error al eliminar el eslogan" });
  }
};

export { getSlogan, updateSlogan, deleteSlogan };
