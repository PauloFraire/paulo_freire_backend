import express from 'express';
import {
    getUsers,
    getUserById,
    getUserByEmail,
    addUser,
    updateUser,
    deleteUser,
    login,
    updateUserByEmail,
    isPasswordInHistory 
} from '../controllers/userController.js';

const router = express.Router();

router.get('/user', getUsers);
router.get('/user/:id', getUserById);
router.get('/user/email/:email', getUserByEmail);
router.post('/user', addUser);
router.post('/login', login);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);
router.put('/user/email/:email', updateUserByEmail);

// Ruta para verificar si la contraseña ya existe en el historial
router.post('/user/password-history', async (req, res) => {
    const { email, password } = req.body;

    try {
        const exists = await isPasswordInHistory(email, password);
        if (exists) {
            return res.status(400).json({ message: 'La contraseña ya ha sido utilizada anteriormente.' });
        } else {
            return res.status(200).json({ message: 'La contraseña es nueva.' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

export default router;
