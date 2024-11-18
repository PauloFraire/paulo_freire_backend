// politicasController.js
import Politica from "../models/Politicas.js";

// Obtener términos o políticas
const getPoliticas = async (req, res) => {
  try {
    const politicas = await Politica.find();
    res.json(politicas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Agregar una nueva política
const addPolitica = async (req, res) => {
  const { title, content } = req.body;

  try {
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Todos los campos son necesarios" });
    }

    const politica = new Politica({
      title,
      content,
      versions: [{ version: "1.0", createdAt: Date.now() }], // Establecer versión inicial al agregar
    });

    await politica.save();
    res.status(201).json(politica);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Editar una política existente
const editPolitica = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const politica = await Politica.findById(id);
    if (!politica) {
      return res.status(404).json({ message: "Política no encontrada" });
    }

    // Obtener la última versión y crear una nueva
    const lastVersion = politica.versions.length
      ? parseFloat(politica.versions[politica.versions.length - 1].version)
      : 0;

    const newVersion = (lastVersion + 0.1).toFixed(1); // Incrementar versión

    // Actualizar los campos y agregar la nueva versión
    politica.title = title ?? politica.title;
    politica.content = content ?? politica.content;

    // Agregar nueva versión al historial
    politica.versions.push({ version: newVersion, createdAt: Date.now() });

    const updatedPolitica = await politica.save();
    res.json(updatedPolitica);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar una política
const deletePolitica = async (req, res) => {
  const { id } = req.params;

  try {
    const politica = await Politica.findByIdAndDelete(id);
    if (!politica) {
      return res.status(404).json({ message: "Política no encontrada" });
    }

    res.json({ message: "Política eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Establecer una política como vigente
const setPoliticaVigente = async (req, res) => {
  const { id } = req.params;

  try {
    // Desactivar todas las políticas actuales
    await Politica.updateMany({}, { isActive: false });

    // Activar la política seleccionada
    const politica = await Politica.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    res.json(politica);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener la política vigente
const getPoliticaVigente = async (req, res) => {
  try {
    const politicaVigente = await Politica.findOne({ isActive: true });
    res.json(politicaVigente);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getPoliticas,
  addPolitica,
  editPolitica,
  deletePolitica,
  setPoliticaVigente,
  getPoliticaVigente,
};
