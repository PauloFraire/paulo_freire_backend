import mongoose from "mongoose";

const PoliticaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  versions: [
    {
      version: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  isActive: {
    type: Boolean,
    default: false, // Nuevo campo para la política vigente
  },
});

// Versión inicial
PoliticaSchema.pre("save", function (next) {
  if (this.isNew) {
    this.versions.push({ version: "1.0" }); // Agregar versión inicial
  }
  next();
});

const Politica = mongoose.model("Politica", PoliticaSchema);
export default Politica;
