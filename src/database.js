const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/photoapp')
      .then(db => console.log('DB is Connected'))
      .catch(err => console.error(err));
