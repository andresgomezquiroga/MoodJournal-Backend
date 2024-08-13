import express, { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { createUser, getAllUser, deleteUser, getUserById, updateUser } from '../controllers/users.controller'

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const HeaderToken = req.header('authorization')
    const token = HeaderToken && HeaderToken.split(' ')[1]
    if (!token) {
        return res.status(401).json({ error: "No autorizado" })
    }
    jwt.verify(token, JWT_SECRET, (error, decored) => {
        if (error) {
            console.log('Error en la autenticacion', error)
            return res.status(403).json({ error: "No tiene acceso a este recurso" })
        }
        next()
    })
}

router.post('/', authenticateToken, createUser)
router.get('/', authenticateToken, getAllUser)
router.get('/:id', authenticateToken, getUserById)
router.put('/:id', authenticateToken, updateUser)
router.delete('/:id', authenticateToken, deleteUser)
export default router