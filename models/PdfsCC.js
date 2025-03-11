import mongoose from "mongoose"; 

const pdfsCCSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    imagen: {
        type: String,
        default: null
    },
    imagen_public_id: {
        type: String,
        default: null
    },
    archivo: {
        type: String,
        required: true
    },
    archivo_public_id: {
        type: String,
        required: true
    },
    tipo: {
        type: Number,
        required: true,
        enum: [0, 1]
    }
}, {
    timestamps: true
});

const PdfsCC = mongoose.model("PdfsCC", pdfsCCSchema);

export default PdfsCC;
