//Beca.js
import mongoose from "mongoose";

const PdfSchema = new mongoose.Schema({
  url: { type: String, required: true },
  name: { type: String, required: true },
});

const BecaSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true }, // URL de Cloudinary
    title: { type: String, required: true },
    description: { type: String, required: true },
    requisitos: { type: String, required: true },
    pdfs: [PdfSchema], // PDFs embebidos
  },
  { timestamps: true }
);

const Beca = mongoose.model(
  "Becas",
  BecaSchema
);

export default Beca;