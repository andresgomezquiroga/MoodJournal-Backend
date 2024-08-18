import path from 'path';
import multer from 'multer';

export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Usa una ruta absoluta para evitar problemas de resolución de rutas
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop(); // Obtiene la extensión del archivo
        cb(null, `${Date.now()}.${ext}`); // Guarda el archivo con un nombre único
    }
});

const upload = multer({ storage });

export default upload;
