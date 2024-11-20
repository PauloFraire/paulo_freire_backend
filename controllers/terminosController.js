import Termino from "../models/Termino.js";

// Obtener todos los Terminos
const getTerminos = async (req, res) => {
  try {
    const Terminos = await Termino.find();
    res.json(Terminos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Agregar un nuevo Termino
const addTermino = async (req, res) => {
  const { title, content } = req.body;

  try {
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Todos los campos son necesarios" });
    }

    // Desactivar todos los Terminos existentes
    await Termino.updateMany({}, { isActive: false });

    // Crear un nuevo Termino y asignar la versión calculada automáticamente
    const termino = new Termino({
      title,
      content,
      isActive: true, // Marcar como activo el nuevo Termino
    });

    // Guardar el Termino
    await termino.save();

    res.status(201).json(termino);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al agregar el Termino" });
  }
};

// Editar un Termino existente creando una nueva versión basada en una versión anterior
const editTermino = async (req, res) => {
  const { id } = req.params; // ID del Termino que se va a editar
  const { title, content } = req.body;

  try {
    // Buscar el Termino base por ID
    const baseTermino = await Termino.findById(id);
    if (!baseTermino) {
      return res.status(404).json({ message: "Termino no encontrado" });
    }

    // Desactivar el Termino actualmente activo
    await Termino.updateMany({}, { isActive: false });

    // Obtener la última versión general para calcular la siguiente versión
    const lastTermino = await Termino.find().sort({ version: -1 }).limit(1);
    const nextVersion = (parseFloat(lastTermino[0].version) + 1).toFixed(1);

    // Crear un nuevo Termino basado en el Termino seleccionado
    const newTermino = new Termino({
      title: title ?? baseTermino.title,
      content: content ?? baseTermino.content,
      version: nextVersion,
      baseVersion: baseTermino.version, // Registrar de qué versión se originó
      isActive: true, // Establecer el nuevo Termino como activo
    });

    await newTermino.save();
    res.json(newTermino);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un Termino
const deleteTermino = async (req, res) => {
  const { id } = req.params;

  try {
    const termino = await Termino.findByIdAndDelete(id);
    if (!termino) {
      return res.status(404).json({ message: "Termino no encontrado" });
    }

    res.json({ message: "Termino eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Establecer un Termino como vigente
const setTerminoVigente = async (req, res) => {
  const { id } = req.params;

  try {
    // Desactivar todos los Terminos actuales
    await Termino.updateMany({}, { isActive: false });

    // Activar el Termino seleccionado
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

// Obtener el Termino vigente
const getTerminoVigente = async (req, res) => {
  try {
    const TerminoVigente = await Termino.findOne({ isActive: true });
    if (!TerminoVigente) {
      return res.status(200).json(null);
    }
    res.json(TerminoVigente);
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
