import mongoose from "mongoose";

const DeslindeSchema = new mongoose.Schema(
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

DeslindeSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastDeslinde = await Deslinde.find().sort({ createdAt: -1 }).limit(1);
    if (lastDeslinde.length > 0) {
      const lastVersion = lastDeslinde[0].version;
      const newVersionNumber = (parseFloat(lastVersion) + 1).toFixed(1);
      this.version = newVersionNumber;
    } else {
      this.version = "1.0";
    }
  }
  next();
});

const Deslinde = mongoose.model("Deslinde", DeslindeSchema);
export default Deslinde;
