import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Asegura que no haya correos duplicados
    },
    password: {
        type: String,
        required: true
    },
    old_passwords: {
        type: [String], // Un arreglo de contraseñas anteriores
        default: []
    },
    role: {
        type: Number,
        default: 0
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date
    }
}, {
    timestamps: true
});

// Pre-guarda para mantener un historial limitado de contraseñas (opcional)
UserSchema.pre('save', function (next) {
    const MAX_OLD_PASSWORDS = 15; // Número máximo de contraseñas a mantener en el historial

    if (this.isModified('password')) {
        // Agregar la contraseña actual al historial antes de actualizarla
        if (this.old_passwords.length >= MAX_OLD_PASSWORDS) {
            this.old_passwords.pop(); // Elimina la contraseña más antigua si el límite es superado
        }
        this.old_passwords.unshift(this.password); // Agrega la contraseña actual al inicio del arreglo
    }

    next();
});

const User = mongoose.model('User', UserSchema);

export default User;
