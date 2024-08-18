import jwt from 'jsonwebtoken';
import { User } from '../interface/user.interface';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

export const generateToken = (user: User): string => {

    return jwt.sign({ id: user.id, email: user.email, name: user.name, last_name: user.last_name, age: user.age }, JWT_SECRET, { expiresIn: '10h' });
};
