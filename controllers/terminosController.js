//terminosController.js
import Termino from "../models/Termino.js";

// Obtener todos los términos
const getTerminos = async (req, res) => {
  try {
    const terminos = await Termino.find();
    res.json(terminos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Agregar un nuevo término
const addTermino = async (req, res) => {
  const { title, content } = req.body;

  try {
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Todos los campos son necesarios" });
    }

    const termino = new Termino({
      title,
      content,
      versions: [{ version: "1.0", createdAt: Date.now() }],
    });

    await termino.save();
    res.status(201).json(termino);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Editar un término existente
const editTermino = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const termino = await Termino.findById(id);
    if (!termino) {
      return res.status(404).json({ message: "Término no encontrado" });
    }

    // Obtener la última versión
    const lastVersion = termino.versions.length
      ? parseFloat(termino.versions[termino.versions.length - 1].version)
      : 0;
    const newVersion = (lastVersion + 0.1).toFixed(1);

    // Actualizar campos
    termino.title = title ?? termino.title;
    termino.content = content ?? termino.content;

    // Agregar nueva versión al historial
    termino.versions.push({ version: newVersion, createdAt: Date.now() });

    const updatedTermino = await termino.save();
    res.json(updatedTermino);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un término
const deleteTermino = async (req, res) => {
  const { id } = req.params;

  try {
    const termino = await Termino.findByIdAndDelete(id);
    if (!termino) {
      return res.status(404).json({ message: "Término no encontrado" });
    }

    res.json({ message: "Término eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Establecer un término como vigente
const setTerminoVigente = async (req, res) => {
  const { id } = req.params;

  try {
    // Desactivar todos los términos actuales
    await Termino.updateMany({}, { isActive: false });

    // Activar el término seleccionado
    const termino = await Termino.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    res.json(termino);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener el término vigente
const getTerminoVigente = async (req, res) => {
  try {
    const terminoVigente = await Termino.findOne({ isActive: true });
    res.json(terminoVigente);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export {
  getTerminos,
  addTermino,
  editTermino,
  deleteTermino,
  setTerminoVigente,
  getTerminoVigente,
};
