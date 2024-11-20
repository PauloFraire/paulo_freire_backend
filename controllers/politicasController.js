import Politica from "../models/Politicas.js";

// Obtener todas las políticas
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

    // Desactivar todas las políticas existentes
    await Politica.updateMany({}, { isActive: false });

    // Crear una nueva política y asignar la versión inicial
    const politica = new Politica({
      title,
      content,
      isActive: true, // Marcar como activa la nueva política
    });

    // Guardar la política
    await politica.save();

    res.status(201).json(politica);
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "Error al agregar la política" });
  }
};

// Editar una política existente creando una nueva versión basada en una versión anterior
const editPolitica = async (req, res) => {
  const { id } = req.params; // ID de la política que se va a editar
  const { title, content } = req.body;

  try {
    // Buscar la política base por ID
    const basePolitica = await Politica.findById(id);
    if (!basePolitica) {
      return res.status(404).json({ message: "Política no encontrada" });
    }

    // Desactivar la política actualmente activa
    await Politica.updateMany({}, { isActive: false });

    // Obtener la última versión general para calcular la siguiente versión
    const lastPolitica = await Politica.find().sort({ version: -1 }).limit(1);
    const nextVersion = (parseFloat(lastPolitica[0].version) + 1).toFixed(1);

    // Crear una nueva política basada en la política seleccionada
    const newPolitica = new Politica({
      title: title ?? basePolitica.title,
      content: content ?? basePolitica.content,
      version: nextVersion,
      baseVersion: basePolitica.version, // Registrar de qué versión se originó
      isActive: true, // Establecer la nueva política como activa
    });

    await newPolitica.save();
    res.json(newPolitica);
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
    if (!politicaVigente) {
      return res.status(200).json(null);
    }
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
