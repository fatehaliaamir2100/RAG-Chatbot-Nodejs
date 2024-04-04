const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { MongoDBAtlasVectorSearch} = require("@langchain/mongodb");
const { MongoClient } = require("mongodb");
const { Document } = require("langchain/document")  ;
const { JSONLoader } = require("langchain/document_loaders/fs/json");
const fs = require('fs');
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

class Embeddings {
    async uploadEmbeddingsToVector(data, index_name) {
        try { 
            const client = new MongoClient(""); //add your MongoDB Atlas connection string
            const database = client.db(""); //add your MongoDB Atlas database name
            const collection = database.collection(""); //add your MongoDB Atlas collection name
            const dbConfig = {  
            collection: collection, //add collection here
            indexName: "vector_index", //add Vector Index name
            textKey: "text", //you can leave this unchanged
            embeddingKey: "embedding", //you can leave this unchanged
            };

            const embedding_model = new OpenAIEmbeddings({
                openAIApiKey: "", //add your OpenAI API Key
                modelName: "text-embedding-3-small"}) //you can leave this unchanged
            
            let docs = [] //initialize an empty array for the documents

            docs.push(new Document({ pageContent: JSON.stringify(data), metadata: []})) //adding the incoming data to the array
            
            const vectorStore = await MongoDBAtlasVectorSearch.fromDocuments(docs, embedding_model, dbConfig); //vector store intialization

            return {"success": true, "vector_store": vectorStore} //returns true if successful
        } catch (error) {
                console.error("Error uploading embeddings:", error);
                return { "success": false, "error": error.message }; //returns false if unsuccessful
        }
    }

    async uploadEmbeddingsFIleToVector(file_path, index_name) {
        try {
            console.log("here1");
            const client = new MongoClient(""); //add your MongoDB Atlas connection string
            const database = client.db(""); //add your MongoDB Atlas database name
            const collection = database.collection(""); //add your MongoDB Atlas collection name
            const dbConfig = {  
            collection: collection, //add collection here
            indexName: "vector_index", //add Vector Index name
            textKey: "text", //You can leave this unchanged
            embeddingKey: "embedding", //You can leave this unchanged
            };

            const embedding_model = new OpenAIEmbeddings({
                openAIApiKey: "", //add your OpenAI API Key
                modelName: "text-embedding-3-small"}) //You can leave this unchanged

            const data = await fs.readFileSync(file_path, { encoding: 'utf8' }); // Read file asynchronously with encoding option
            console.log("here1", data);

            let docs = []
            docs.push(new Document({ pageContent: data, metadata: []})) //adding the incoming data to the array
            console.log("here2", docs);

            const vectorStore = await MongoDBAtlasVectorSearch.fromDocuments(docs, embedding_model, dbConfig); //vector store intialization
            console.log("here3", vectorStore);

            return {"success": true} //returns true if successful
        } catch (error) {
                console.error("Error uploading embeddings:", error);
                return { "success": false, "error": error.message }; //returns false if unsuccessful
        }    
    }
}

module.exports = Embeddings;





