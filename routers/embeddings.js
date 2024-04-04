const express = require('express');
const EmbeddingRouter = express.Router();
const Embeddings = require('../services/embeddings');

EmbeddingRouter.post('/upload_embeddings_data', async (req, res) => { //endpoint to directly upload embeddings
    try {
        const { data, index_name } = req.body; //getting file_data and index_name
        const embeddings = new Embeddings(); //initialize Embeddings object

        const embeddingStatus = await embeddings.uploadEmbeddingsToVector(data, index_name); //function to upload embeddings
    
        res.json(embeddingStatus).status(200); //return response with status 200
    } catch (error) {
        console.error('Error uploading embeddings:', error);
        res.status(500).json({ error: `Internal server error ${error}` }); //return response with status 500 and error
    }
});

EmbeddingRouter.post('/upload_embeddings_file', async (req, res) => { //endpoint to upload embeddings through file
    try {
        const { file_path, index_name } = req.body; //getting file_data and index_name
        const embeddings = new Embeddings(); //initialize Embeddings object

        const embeddingStatus = await embeddings.uploadEmbeddingsFIleToVector(file_path, index_name); //function to upload embeddings
    
        res.json(embeddingStatus).status(200); //return response with status 200
    } catch (error) {
        console.error('Error uploading embeddings:', error);
        res.status(500).json({ error: `Internal server error ${error}` }); //return response with status 500 and error
    }
});

module.exports = EmbeddingRouter;

