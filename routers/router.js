const express = require('express');
const app = express();
const embeddings = require('./embeddings');
const queryProcessor = require('./queryProcessor');

app.use(express.json()); //using express.json to enable json parsing
app.use('/embeddings', embeddings); //using embeddings routes
app.use('/query_processor', queryProcessor); //using queryProcessor routes

module.exports = app;