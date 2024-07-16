import bcrypt from 'bcrypt'
import { Response } from 'express'


const SALT_RAUND: number = 10

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_RAUND)
} 

// leer y comprar con el hash  de las bases de datos

export const comparePassword = async(password: string, hash: string) : Promise<boolean> => {
    return await bcrypt.compare(password, hash)
}

export const validateRegister = (email: string, password: string, name: string, last_name: string, age: number, res: Response) => {
    if (!email) {
        res.status(400).json({error: "el email es requerido"})
    }
    if (!password) {
        res.status(400).json({error: "La contraseña es requerida"})
    }
    if (!name) {
        res.status(400).json({error: "El nombre es requerido"})
    }
    if (!last_name) {
        res.status(400).json({error: "El apellido es requerido"})
    }
    if (!age) {
        res.status(400).json({error: "La edad es requerida"})
    }
}