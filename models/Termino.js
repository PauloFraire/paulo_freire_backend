//Termino.js
import mongoose from "mongoose";

const TerminoSchema = new mongoose.Schema({
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
    default: false, // Por defecto, los términos son inactivos
  },
});

// Establecer versión inicial para nuevos términos
TerminoSchema.pre("save", function (next) {
  if (this.isNew) {
    this.versions.push({ version: "1.0" });
  }
  next();
});

const Termino = mongoose.model("Termino", TerminoSchema);
export default Termino;
