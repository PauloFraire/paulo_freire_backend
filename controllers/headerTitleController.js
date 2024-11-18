import HeaderTitle from "../models/HeaderTitle.js";

// Obtener el título de la página
const getHeaderTitle = async (req, res) => {
  try {
    const headerTitle = await HeaderTitle.findOne();
    res.status(200).json(headerTitle || { title: "" });
  } catch (error) {
    console.error("Error al obtener el título:", error);
    res.status(500).json({ error: "Error al obtener el título" });
  }
};

// Agregar o actualizar el título
const addOrUpdateHeaderTitle = async (req, res) => {
  const { title } = req.body;

  if (!title || title.length < 10 || title.length > 100) {
    return res.status(400).json({
      error: "El título debe tener entre 10 y 100 caracteres",
    });
  }

  try {
    let headerTitle = await HeaderTitle.findOne();

    if (headerTitle) {
      headerTitle.title = title;
    } else {
      headerTitle = new HeaderTitle({ title });
    }

    await headerTitle.save();
    res.status(200).json(headerTitle);
  } catch (error) {
    console.error("Error al agregar o actualizar el título:", error);
    res.status(500).json({ error: "Error al guardar el título" });
  }
};

// Eliminar el título
const deleteHeaderTitle = async (req, res) => {
  try {
    const headerTitle = await HeaderTitle.findOne();
    if (headerTitle) {
      await HeaderTitle.deleteOne();
      res.status(200).json({ message: "Título eliminado con éxito" });
    } else {
      res.status(404).json({ error: "Título no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar el título:", error);
    res.status(500).json({ error: "Error al eliminar el título" });
  }
};

export { getHeaderTitle, addOrUpdateHeaderTitle, deleteHeaderTitle };
