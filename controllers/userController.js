import User from "../models/User.js";
import bcrypt from 'bcrypt';
import generateJWT from "../helpers/generateJWT.js";
import axios from 'axios';

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get user by id
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            const error = new Error('Id requerido');
            return res.status(400).json(error.message);
        }

        const user = await User.findById(id);

        if (!user) {
            const error = new Error('Usuario no encontrado');
            return res.status(400).json(error.message);
        }

        res.json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

// Login
const login = async (req, res) => {
    const { email, password, captcha } = req.body;

    try {
        if (!email || !password || !captcha) {
            return res.status(400).json({ message: 'Todos los campos son necesarios' });
        }

        // Verificar el captcha
        const secret = '6LeHymIqAAAAAJ5GOGt1moCOYemNgb-irkCCX6s4';
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${captcha}`);
        if (!response.data.success) {
            return res.status(400).json({ message: 'Captcha inválido' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        // Comprobar si la cuenta está bloqueada
        const currentTime = new Date();
        if (user.lockUntil && user.lockUntil > currentTime) {
            const remainingTime = Math.ceil((user.lockUntil - currentTime) / 1000 / 60); // en minutos
            return res.status(403).json({ message: `Cuenta bloqueada. Intenta nuevamente en ${remainingTime} minutos.` });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            user.loginAttempts = (user.loginAttempts || 0) + 1;

            // Si se alcanzan 3 intentos fallidos, bloquear la cuenta
            if (user.loginAttempts >= 3) {
                user.lockUntil = new Date(currentTime.getTime() + 10 * 60000); // Bloquear por 10 minutos
                user.loginAttempts = 0; // Reseteamos el conteo de intentos
            }

            await user.save();
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        // Si el inicio de sesión es exitoso, reiniciar los intentos y el bloqueo
        user.loginAttempts = 0;
        user.lockUntil = null; // Desbloquear
        await user.save();

        const token = generateJWT(user.id);
        const payload = {
            user: {
                id: user.id,
                name: `${user.name} ${user.lastName}`,
                email: user.email,
                token: token,
                role: user.role,
            },
        };

        res.json(payload);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

// Create user
const addUser = async (req, res) => {
    const { name, lastName, email, password, role } = req.body;

    try {
        if (!name || !lastName || !email || !password || role === undefined) {
            const error = new Error('Todos los campos son necesarios');
            return res.status(400).json(error.message);
        }

        const userExist = await User.findOne({ email });

        if (userExist) {
            const error = new Error('El usuario ya existe');
            return res.status(400).json(error.message);
        }

        const user = new User({
            name,
            lastName,
            email,
            password,
            role
        });

        user.password = await bcrypt.hashSync(password, 10);
        await user.save();

        res.json({ message: 'Usuario creado correctamente' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

// Update user
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, lastName, email, password } = req.body;

    try {
        if (!id) {
            const error = new Error('Id requerido');
            return res.status(400).json(error.message);
        }

        if (!name || !lastName || !email || !password) {
            const error = new Error('Todos los campos son necesarios');
            return res.status(400).json(error.message);
        }

        const user = await User.findById(id);

        if (!user) {
            const error = new Error('Usuario no encontrado');
            return res.status(400).json(error.message);
        }

        user.name = name;
        user.lastName = lastName;
        user.email = email;
        user.password = bcrypt.hashSync(password, 10);

        await user.save();

        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

// Delete user 
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            const error = new Error('ID requerido');
            return res.status(400).json(error.message);
        }

        const userExist = await User.findById(id);

        if (!userExist) {
            const error = new Error('Usuario no encontrado');
            return res.status(400).json(error.message);
        }

        await User.findByIdAndDelete(id);

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

// Get user by email
const getUserByEmail = async (req, res) => {
    const { email } = req.params;

    try {
        if (!email) {
            const error = new Error('Email requerido');
            return res.status(400).json(error.message);
        }

        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error('Usuario no encontrado');
            return res.status(404).json(error.message);
        }

        res.json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

// Editar usuario por email
const updateUserByEmail = async (req, res) => {
    const { email } = req.params;
    const { name, lastName, password, role } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ message: 'Email requerido' });
        }

        // Encontrar al usuario por su correo electrónico
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Actualizar los campos si se proporcionan
        user.name = name || user.name;
        user.lastName = lastName || user.lastName;
        user.role = role !== undefined ? role : user.role;

        if (password) {
            user.password = bcrypt.hashSync(password, 10);
        }

        // Guardar cambios en la base de datos
        await user.save();

        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

export {
    getUsers,
    getUserById,
    getUserByEmail,
    addUser,
    updateUser,
    deleteUser,
    login,
    updateUserByEmail
}
