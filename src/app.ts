import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import authRoutes from './routes/auth.routes'
import bodyParser from 'body-parser';
import cors from 'cors'; // Importa el paquete cors


const app = express()

app.use(express.json())

app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:5173', // Permitir solicitudes solo desde este origen
    methods: ['GET', 'POST'], // metodos htttp
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
}));

//Routes

app.use('/auth', authRoutes)
//authentication
// api rest de usuarios

console.log("Esto esta siendo ejecutado")

export default app