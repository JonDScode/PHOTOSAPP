const { Router } = require('express');
const router = Router();

const path = require('path');
const { unlink } = require('fs-extra');

const Image = require('../models/Image');

router.get('/', async (req, res) => {
  const images = await Image.find();
  res.render('index', { images });
});

router.get('/upload', (req, res) => {
  res.render('upload');
});

router.post('/upload', async (req, res) => {
  const image = new Image();
  image.title = req.body.title;
  image.description = req.body.description;
  image.filename = req.file.filename;
  image.path = '/img/uploads/' + req.file.filename;
  image.originalname = req.file.originalname;
  image.mimetype = req.file.mimetype;
  image.size = req.file.size;

  await image.save();

  res.redirect('/');
});

router.get('/image/:id', async (req, res) => {
  const { id } = req.params;
  const image = await Image.findById(id);
  console.log(image);
  res.render('profile', { image });
});

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
    console.error('Error en la ruta PUT:', error);
    res.status(500).send(error.message);
  }
});



router.get('/image/:id/delete', async (req, res) => {
  const { id } = req.params;
  const image = await Image.findByIdAndDelete(id);
  await unlink(path.resolve('./src/public' + image.path));
  res.redirect('/');
  res.send('Imagen actualizada exitosamente');
});

module.exports = router;