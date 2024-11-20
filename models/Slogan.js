import mongoose from "mongoose";

const sloganSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    maxlength: 100, // Validación para el límite de caracteres
  },
});

const Slogan = mongoose.model("Slogan", sloganSchema);
export default Slogan;
