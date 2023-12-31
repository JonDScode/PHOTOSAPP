const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/photoapp', {
      useUnifiedTopology: true,
      useNewUrlParser: true
})
      .then(db => console.log('DB is Connected'))
      .catch(err => console.error(err));