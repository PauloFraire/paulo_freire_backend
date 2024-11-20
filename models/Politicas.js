import mongoose from "mongoose";

const PoliticaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    version: {
      type: String,
      required: true,
      default: "1.0", // Versión inicial
    },
    isActive: {
      type: Boolean,
      default: false, // Campo para la política vigente
    },
    baseVersion: {
      type: String, // Indica la versión base sobre la cual se creó esta versión.
      default: null,
    },
  },
  { timestamps: true } // Habilita automáticamente createdAt y updatedAt
);

// Lógica para incrementar la versión automáticamente
PoliticaSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastPolitica = await Politica.find().sort({ createdAt: -1 }).limit(1);
    if (lastPolitica.length > 0) {
      const lastVersion = lastPolitica[0].version;
      const newVersionNumber = (parseFloat(lastVersion) + 1).toFixed(1);
      this.version = newVersionNumber;
    } else {
      this.version = "1.0";
    }
  }
  next();
});

const Politica = mongoose.model("Politica", PoliticaSchema);
export default Politica;
