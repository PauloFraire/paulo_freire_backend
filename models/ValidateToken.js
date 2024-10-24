import mongoose from "mongoose";
import bcrypt from "bcrypt";

const ValidateTokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
    },
    token: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 5 * 60 * 1000), // Expira en 5 minutos
    },
    isValid: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

// Middleware para encriptar el token antes de guardar
ValidateTokenSchema.pre('save', async function (next) {
    if (!this.isModified('token')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.token = await bcrypt.hash(this.token, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar tokens
ValidateTokenSchema.methods.compareToken = async function (candidateToken) {
    return await bcrypt.compare(candidateToken, this.token);
};

const ValidateToken = mongoose.model('ValidateToken', ValidateTokenSchema);

export default ValidateToken;
