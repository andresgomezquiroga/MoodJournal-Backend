import bcrypt from 'bcrypt'


const SALT_RAUND: number = 10

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_RAUND)
} 

// leer y comprar con el hash  de las bases de datos

export const comparePassword = async(password: string, hash: string) : Promise<boolean> => {
    return await bcrypt.compare(password, hash)
}
