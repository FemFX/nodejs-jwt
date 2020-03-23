const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = express();

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', require('./routes/auth'))

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
