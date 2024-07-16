import { Request, Response } from "express";
import { comparePassword, hashPassword, validateRegister } from "../services/password.service";
import prisma from "../models/user";
import { generateToken } from "../services/auth.service";


export const registerUser = async (req: Request, res: Response): Promise<void | Response> => {
    const { email, password, name, last_name, age } = req.body;
    try {
        if (!email) {
            res.status(400).json({ error: "el email es requerido" })
        }
        if (!password) {
            res.status(400).json({ error: "La contraseña es requerida" })
        }
        if (!name) {
            res.status(400).json({ error: "El nombre es requerido" })
        }
        if (!last_name) {
            res.status(400).json({ error: "El apellido es requerido" })
        }
        if (!age) {
            res.status(400).json({ error: "La edad es requerida" })
        }
        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                last_name,
                age
            }
        });

        const token = generateToken(user);
        res.status(201).json({ token, message: "Usuario creado correctamente" });
    } catch (error: any) {
        console.log(error);

        // Manejar el error de correo electrónico duplicado
        if (error.code === 'P2002' && error.meta?.target.includes('email')) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        res.status(500).json({ error: 'Hubo un error en el registro' });
    }
};


export const Login = async (req: Request, res: Response): Promise<void | Response> => {
    const { email, password } = req?.body
    try {

        if (!email) {
            res.status(400).json({ error: "el correo es requerido" })
        }
        else if (!password) {
            res.status(400).json({ error: "La contraseña es requerida" })
        }
        const user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
            return res.status(400).json({ error: "Correo no encontrado" })
        }

        const hashCompareMatch = await comparePassword(password, user.password)
        if (!hashCompareMatch) {
            return res.status(401).json({ error: "Contraseña incorrecta" })
        }
        const token = generateToken(user);

        res.status(201).json({ token, message: "Usuario iniciado sesión correctamente" });
    } catch (error: any) {
        console.log(`Error : ${error}`)
    }
}