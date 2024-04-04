const express = require('express');
const queryProcessorRouter = express.Router();
const QueryProcessor = require('../services/queryProcessor');

queryProcessorRouter.post('/send_message', async (req, res) => { //endpoint to send query and recieve response
    try {
        const { query, index_name } = req.body; //getting query
        const queryProcessorInstance = new QueryProcessor(); //initialize queryProcessor object

        const result = await queryProcessorInstance.processQuery(query, index_name); //process query and return result

        res.json(result).status(200); //return response with status 200
    } catch (error) {
        console.error('Error sending chat message:', error);
        res.status(500).json({ error: `Internal server error ${error}` }); //return response with status 500 and error
    }
});

module.exports = queryProcessorRouter;
