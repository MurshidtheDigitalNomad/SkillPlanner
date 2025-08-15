const express = require('express');
const cors = require('cors');

const app = express();

const userRoutes = require('./routes/users/users.routes');
const resourceRoutes = require('./routes/resources/resources.routes');

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use('/api/users', userRoutes);
//app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/resources', resourceRoutes);

module.exports= app;