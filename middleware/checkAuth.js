import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const checkAuth = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, "asdASDqweQWE123");

            req.usuario = await User.findById(decoded.id).select(
                "-password -confirmado -token -createdAt -updatedAt -__v"
            );

            if (!req.usuario) {
                return res.status(401).json({ msg: "Usuario no encontrado" });
            }

            return next();
        } catch (error) {
            console.log("Error en checkAuth:", error);
            return res.status(401).json({ msg: "Token inválido o expirado" });
        }
    }

    if (!token) {
        return res.status(401).json({ msg: "Token no válido" });
    }
};

const isAdmin = async (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({ msg: "Usuario no autenticado" });
    }

    console.log("Rol del usuario:", req.usuario.role);

    // Cambiar la condición de acceso
    if (req.usuario.role !== 1) { // En vez de 0, permitir rol 1 si es el admin
        return res.status(403).json({ msg: "Acceso No Autorizado" });
    }

    next();
};


export { checkAuth, isAdmin };
