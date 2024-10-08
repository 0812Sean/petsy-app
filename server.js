const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const testJWTRouter = require('./controllers/test-jwt');
const profilesRouter = require('./controllers/profiles');
const usersRouter = require('./controllers/users');
const listRouter = require('./controllers/list');
const path = require('path');

const PORT = process.env.PORT ? process.env.PORT : 3000;

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes go here
app.use('/users', usersRouter);
app.use('/test-jwt', testJWTRouter);
app.use('/profiles', profilesRouter);
app.use('/lists', listRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
