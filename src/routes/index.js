const { Router } = require('express');
const router = Router();

const path = require('path');
const { unlink } = require('fs-extra');

const Image = require('../models/Image'); // Importar el modelo de imágenes

// Ruta principal que muestra todas las imágenes
router.get('/', async (req, res) => {
  const images = await Image.find(); // Obtener todas las imágenes desde la base de datos
  res.render('index', { images }); // Renderizar la vista 'index' con las imágenes
});

// Ruta para mostrar el formulario de carga de imágenes
router.get('/upload', (req, res) => {
  res.render('upload'); // Renderizar la vista 'upload' para cargar imágenes
});

// Ruta para procesar la carga de imágenes
router.post('/upload', async (req, res) => {
  try {
    const image = new Image(); // Crear una nueva instancia del modelo de imágenes
    image.title = req.body.title;
    image.description = req.body.description;
    image.filename = req.file.filename;
    image.path = '/img/uploads/' + req.file.filename;
    image.originalname = req.file.originalname;
    image.mimetype = req.file.mimetype;
    image.size = req.file.size;
    image.created_at = new Date();

    await image.save(); // Guardar la imagen en la base de datos

    // Imprimir datos de la imagen subida
    console.log('Imagen subida:', image);

    res.redirect('/'); // Redirigir a la página principal
  } catch (error) {
    console.error('Error en la ruta POST /upload:', error);
    res.status(500).send(error.message);
  }
});

// Ruta para mostrar la información detallada de una imagen
router.get('/image/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findById(id); // Buscar la imagen por su ID en la base de datos

    // Imprimir datos de la imagen obtenida
    console.log('Imagen encontrada:', image);

    res.render('profile', { image }); // Renderizar la vista 'profile' con la información de la imagen
  } catch (error) {
    console.error('Error en la ruta GET /image/:id:', error);
    res.status(500).send(error.message);
  }
});

// Ruta para procesar la actualización de la información de una imagen
router.post('/image/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Intentando actualizar la imagen con ID: ${id}`);

    const updatedImage = await Image.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
        description: req.body.description,
        // Otros campos que desees actualizar...
      },
      { new: true } // Devuelve la imagen actualizada en la respuesta
    );

    console.log('Imagen actualizada:', updatedImage);

    if (!updatedImage) {
      console.log('Imagen no encontrada');
      return res.status(404).send('Imagen no encontrada');
    }

    // Redirecciona a la página principal
    console.log('Redirigido a la página principal');
    res.redirect('/');
  } catch (error) {
    console.error('Error en la ruta PUT /image/:id:', error);
    res.status(500).send(error.message);
  }
});

// Ruta para eliminar una imagen
router.get('/image/:id/delete', async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findByIdAndDelete(id); // Buscar y eliminar la imagen por su ID

    // Imprimir datos de la imagen eliminada
    console.log('Imagen eliminada:', image);

    await unlink(path.resolve('./src/public' + image.path)); // Eliminar la imagen del sistema de archivos
    res.redirect('/'); // Redirigir a la página principal
  } catch (error) {
    console.error('Error en la ruta GET /image/:id/delete:', error);
    res.status(500).send(error.message);
  }
});

module.exports = router; // Exportar las rutas
