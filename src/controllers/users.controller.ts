import { Request, Response } from "express";
import { hashPassword } from "../services/password.service";
import prisma from "../models/user";


export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name, last_name, age } = req.body;

        // Validaciones
        if (!email) {
            res.status(400).json({ error: "El email es requerido" });
            return;
        }
        if (!password) {
            res.status(400).json({ error: "La contraseña es requerida" });
            return;
        }
        if (!name) {
            res.status(400).json({ error: "El nombre es requerido" });
            return;
        }
        if (!last_name) {
            res.status(400).json({ error: "El apellido es requerido" });
            return;
        }
        if (!age) {
            res.status(400).json({ error: "La edad es requerida" });
            return;
        }

        // Hash de la contraseña
        const hashedPassword = await hashPassword(password);

        // Creación del usuario
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                last_name,
                age,
            }
        });

        // Respuesta exitosa
        res.status(201).json({ message: "Usuario creado exitosamente", user });
    } catch (error: any) {
        if (error.code === 'P2002' && error.meta?.target.includes('email')) {
            res.status(400).json({ error: 'El correo ya está registrado' });
        } else {
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};

export const getAllUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany()
        res.status(201).json(users)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe mas tarde' });
    }
}

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id
    if (isNaN(Number(userId))) {
        res.status(400).json({ error: "ID del usuario no valido" })
    }
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(userId)
            }
        })
        if (!user) {
            res.status(404).json({ error: "El usuario no fue encontrado" })
            return
        }
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe mas tarde' });
    }
}






export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id)
    const { email, password, name, last_name, age } = req.body;
    try {

        let dataToUpdate: { [key: string]: any } = { ...req.body }

        if (password) {
            const hashedPassword = await hashPassword(password)
            dataToUpdate.password = hashedPassword
        }

        if (email) {
            dataToUpdate.email = email
        }

        if (name) {
            dataToUpdate.name = name
        }
        if (last_name) {
            dataToUpdate.last_name = last_name
        }
        if (age) {
            dataToUpdate.age = parseInt(age)
        }

        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data: dataToUpdate
        })
        res.status(200).json({
            message: 'Usuario actualizado exitosamente', user
        })
    } catch (error: any) {
        if (error.code === 'P2002' && error.meta?.target.includes('email')) {
            res.status(400).json({ error: 'El correo ya está registrado' });
        }
        else if (error.code === 'P2025') {
            res.status(404).json({ error: 'Usuario no encontrado' })
        }
        else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe mas tarde' });
        }
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id);
    try {
        // Obtener el usuario antes de eliminarlo
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            res.status(404).json({
                error: 'Usuario no encontrado',
            });
            return;
        }

        // Eliminar el usuario
        await prisma.user.delete({
            where: {
                id: userId,
            },
        });

        res.status(200).json({
            message: `El usuario ${user.name} ${user.last_name} ha sido eliminado correctamente`,
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            error: 'Hubo un error al eliminar el usuario',
        });
    }
};


export const getProfileById = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id
    const user = await prisma.user.findUnique({
        where: {
            id: Number(userId)
        }
    })
    if (!user) {
        res.status(404).json({ error: 'El usuario no fue encontrado' })
    }
    res.status(200).json(user)
}


export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    const { name, last_name, email, age, password } = req.body;
    const img = req.file?.filename;
    const updateProfile: { [key: string]: any } = { ...req.body };
    const id = req.params.id;

    if (name) updateProfile.name = name;
    if (last_name) updateProfile.last_name = last_name;
    if (email) {
        // Verifica si el email ya está en uso
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser && existingUser.id !== Number(id)) {
            res.status(400).json({ error: 'El email ya está en uso por otro usuario.' });
            return;
        }

        updateProfile.email = email;
    }
    if (age) updateProfile.age = parseInt(age);

    if (password) {
        const passwordHash = await hashPassword(password);
        updateProfile.password = passwordHash;
    }

    if (img) {
        updateProfile.image = `/uploads/${img}`;
    }

    try {
         await prisma.user.update({
            where: { id: Number(id) },
            data: updateProfile,
        });
        res.status(200).json({ message: 'El perfil ha sido actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el perfil' });
    }
};
