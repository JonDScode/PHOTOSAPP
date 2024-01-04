const request = require('supertest');
const app = require('../src/index'); 

describe('GET /', () => {
  it('debería obtener una respuesta exitosa', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});

describe('GET /upload', () => {
  it('debería obtener una respuesta exitosa', async () => {
    const response = await request(app).get('/upload');
    expect(response.statusCode).toBe(200);
  });
});

describe('POST /upload', () => {
  it('debería subir una imagen correctamente', async () => {
    const response = await request(app)
      .post('/upload')
      .attach('image', '/public/img/uploads/test_image.jpg') 
      .field('title', 'Test Image Title')
      .field('description', 'Test Image Description');

    expect(response.statusCode).toBe(302); // Código de redirección
  });

  it('debería manejar errores en la subida de imágenes', async () => {
    const response = await request(app)
      .post('/upload')
      .attach('image', path.resolve(__dirname, '../../public/img/uploads/test_image.jpg'))
      .field('title', 'Test Image Title')
      .field('description', 'Test Image Description');

    expect(response.statusCode).toBe(500); // Código de error interno del servidor
  });
});

describe('GET /image/:id', () => {
  it('debería obtener una respuesta exitosa', async () => {
    // Asume que hay una imagen en la base de datos con ID 1
    const response = await request(app).get('/image/1');
    expect(response.statusCode).toBe(200);
  });
});

describe('POST /image/:id', () => {
  it('debería actualizar una imagen correctamente', async () => {
    // Asume que hay una imagen en la base de datos con ID 1
    const response = await request(app)
      .post('/image/1')
      .send({
        title: 'Updated Test Image Title',
        description: 'Updated Test Image Description',
      });

    expect(response.statusCode).toBe(302); // Código de redirección
  });

  it('debería manejar errores en la actualización de imágenes', async () => {
    // Intenta actualizar una imagen que no existe (ID 999)
    const response = await request(app)
      .post('/image/999')
      .send({
        title: 'Updated Test Image Title',
        description: 'Updated Test Image Description',
      });

    expect(response.statusCode).toBe(404); // Código de no encontrado
  });
});

describe('GET /image/:id/delete', () => {
  it('debería eliminar una imagen correctamente', async () => {
    // Asume que hay una imagen en la base de datos con ID 1
    const response = await request(app).get('/image/1/delete');
    expect(response.statusCode).toBe(302); // Código de redirección
  });

  it('debería manejar errores en la eliminación de imágenes', async () => {
    // Intenta eliminar una imagen que no existe (ID 999)
    const response = await request(app).get('/image/999/delete');
    expect(response.statusCode).toBe(404); // Código de no encontrado
  });
});
