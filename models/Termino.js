import mongoose from "mongoose";

const TerminoSchema = new mongoose.Schema(
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
      default: "1.0",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    baseVersion: {
      type: String, // Indica la versión base sobre la cual se creó esta versión.
      default: null,
    },
  },
  { timestamps: true } // Habilita automáticamente createdAt y updatedAt
);

TerminoSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastTermino = await Termino.find().sort({ createdAt: -1 }).limit(1);
    if (lastTermino.length > 0) {
      const lastVersion = lastTermino[0].version;
      const newVersionNumber = (parseFloat(lastVersion) + 1).toFixed(1);
      this.version = newVersionNumber;
    } else {
      this.version = "1.0";
    }
  }
  next();
});

const Termino = mongoose.model("Termino", TerminoSchema);
export default Termino;
