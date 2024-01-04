// Importar las bibliotecas necesarias
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment'); // Librería para formateo de fechas y horas

// Inicializar la aplicación Express
const app = express();

// Requerir la configuración de la base de datos
require('./database');

// Configuraciones de la aplicación
app.set('port', process.env.PORT || 3000); // Puerto en el que la aplicación escuchará
app.set('views', path.join(__dirname, 'views')); // Directorio de vistas
app.set('view engine', 'ejs'); // Motor de vistas EJS

// Middlewares (funciones que se ejecutan antes de llegar a las rutas)
app.use(morgan('dev')); // Middleware para el registro de solicitudes HTTP en consola
app.use(express.urlencoded({ extended: false })); // Middleware para manejar datos de formularios
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/img/uploads'), // Directorio de destino de las imágenes cargadas
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname)); // Nombre de archivo único utilizando UUID
    }
});
app.use(multer({
    storage: storage
}).single('image')); // Middleware para manejar la carga de imágenes

// Variables globales accesibles en todas las vistas
app.use((req, res, next) => {
    app.locals.moment = moment; // Hacer que la librería moment esté disponible en las vistas
    next();
});

// Rutas de la aplicación
app.use(require('./routes/index'));

// Archivos estáticos (CSS, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public')));


// Iniciar el servidor y escuchar en el puerto configurado
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});
