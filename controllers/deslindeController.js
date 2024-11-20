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

    // Desactivar todos los deslindes existentes
    await Deslinde.updateMany({}, { isActive: false });

    // Crear un nuevo deslinde y asignar la versión calculada automáticamente
    const deslinde = new Deslinde({
      title,
      content,
      isActive: true, // Marcar como activo el nuevo deslinde
    });

    // Guardar el deslinde
    await deslinde.save();

    res.status(201).json(deslinde);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al agregar el deslinde" });
  }
};

// Editar un deslinde existente creando una nueva versión basada en una versión anterior
const editDeslinde = async (req, res) => {
  const { id } = req.params; // ID del deslinde que se va a editar
  const { title, content } = req.body;

  try {
    // Buscar el deslinde base por ID
    const baseDeslinde = await Deslinde.findById(id);
    if (!baseDeslinde) {
      return res.status(404).json({ message: "Deslinde no encontrado" });
    }

    // Desactivar el deslinde actualmente activo
    await Deslinde.updateMany({}, { isActive: false });

    // Obtener la última versión general para calcular la siguiente versión
    const lastDeslinde = await Deslinde.find().sort({ version: -1 }).limit(1);
    const nextVersion = (parseFloat(lastDeslinde[0].version) + 1).toFixed(1);

    // Crear un nuevo deslinde basado en el deslinde seleccionado
    const newDeslinde = new Deslinde({
      title: title ?? baseDeslinde.title,
      content: content ?? baseDeslinde.content,
      version: nextVersion,
      baseVersion: baseDeslinde.version, // Registrar de qué versión se originó
      isActive: true, // Establecer el nuevo deslinde como activo
    });

    await newDeslinde.save();
    res.json(newDeslinde);
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
    if (!deslindeVigente) {
      return res.status(200).json(null); // Explicitamente devolver null
    }
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
