import express from 'express';
import { Login, registerUser } from '../controllers/auth.controller';

const router = express.Router();

// Ruta POST para registrar usuarios
router.post('/register', registerUser);

// Ruta POST para iniciar sesión (aquí necesitas definir la función de callback)
router.post('/login', Login)

export default router;
