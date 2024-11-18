import Deslinde from "../models/Deslinde.js";

// Obtener todos los deslindes
const getDeslindes = async (req, res) => {
  try {
    const deslindes = await Deslinde.find();
    res.json(deslindes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Agregar un nuevo deslinde
const addDeslinde = async (req, res) => {
  const { title, content } = req.body;

  try {
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Todos los campos son necesarios" });
    }

    const deslinde = new Deslinde({
      title,
      content,
      versions: [{ version: "1.0", createdAt: Date.now() }], // Establecer versión inicial
    });

    await deslinde.save();
    res.status(201).json(deslinde);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Editar un deslinde existente
const editDeslinde = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const deslinde = await Deslinde.findById(id);
    if (!deslinde) {
      return res.status(404).json({ message: "Deslinde no encontrado" });
    }

    // Obtener la última versión y crear una nueva
    const lastVersion = deslinde.versions.length
      ? parseFloat(deslinde.versions[deslinde.versions.length - 1].version)
      : 0;

    const newVersion = (lastVersion + 0.1).toFixed(1); // Incrementar versión

    // Actualizar los campos y agregar la nueva versión
    deslinde.title = title ?? deslinde.title;
    deslinde.content = content ?? deslinde.content;

    // Agregar nueva versión al historial
    deslinde.versions.push({ version: newVersion, createdAt: Date.now() });

    const updatedDeslinde = await deslinde.save();
    res.json(updatedDeslinde);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un deslinde
const deleteDeslinde = async (req, res) => {
  const { id } = req.params;

  try {
    const deslinde = await Deslinde.findByIdAndDelete(id);
    if (!deslinde) {
      return res.status(404).json({ message: "Deslinde no encontrado" });
    }

    res.json({ message: "Deslinde eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Establecer un deslinde como vigente
const setDeslindeVigente = async (req, res) => {
  const { id } = req.params;

  try {
    // Desactivar todos los deslindes actuales
    await Deslinde.updateMany({}, { isActive: false });

    // Activar el deslinde seleccionado
    const deslinde = await Deslinde.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    res.json(deslinde);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener el deslinde vigente
const getDeslindeVigente = async (req, res) => {
  try {
    const deslindeVigente = await Deslinde.findOne({ isActive: true });
    res.json(deslindeVigente);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getDeslindes,
  addDeslinde,
  editDeslinde,
  deleteDeslinde,
  setDeslindeVigente,
  getDeslindeVigente,
};
