const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { MongoDBAtlasVectorSearch } = require("@langchain/mongodb");
const { MongoClient } = require("mongodb");
const { ChatAnthropic } = require("@langchain/anthropic");
const { RetrievalQAChain, loadQARefineChain} = require("langchain/chains");
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents");
const { PromptTemplate } = require ("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");


class QueryProcessor {

    async processQuery(query, index_name) {
        try { 
            const client = new MongoClient("mongodb+srv://admin:admin@money-tracker.udgkdwe.mongodb.net/"); //add your MongoDB Atlas connection string
            const database = client.db("langchain_db"); //add your MongoDB Atlas database name
            const collection = database.collection("60b9d3c2a1ebca2426e46f36"); //add your MongoDB Atlas collection name
            const dbConfig = {  
            collection: collection, //add collection here
            indexName: "vector_index", //add Vector Index name
            textKey: "text", //you can leave this unchanged
            embeddingKey: "embedding", //you can leave this unchanged
            };
            console.log("here>>>>>>>>>>>>>>>>>>>>>", collection)

            const embeddings = new OpenAIEmbeddings({ //initializing the OpenAIEmbeddings model
                openAIApiKey: "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", //add your OpenAI API key here
                modelName: "text-embedding-3-small" //leave this unchanged
            })
    
            console.log(">>>>>>>>>>>>>>>>>>", dbConfig);

            const llm = new ChatAnthropic({ //initializing the LLM model
                modelName: "claude-3-haiku-20240307", //leave this unchanged
                maxTokens: 1024, //max tokens in the response
                anthropicApiKey: "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", //add your anthropic API key here
            });

            const vectorStore = await new MongoDBAtlasVectorSearch(embeddings, dbConfig); //initializing vector store
            console.log(">>>>>>>>>>>>>>>>>>", vectorStore); 

            const vectorResult = await vectorStore.similaritySearch(query, 5); //running similarity search for the query
            console.log(">>>>>>>>>>>>>>>>>>", query, "=", vectorResult); 

            const prompt = PromptTemplate.fromTemplate( //add your prompt here to optimize your performance
                "You are a ledger agent that will analyse and give statistical reponses for the data USER: CONTEXT: {context} QUESTION: {question}"
            )

            const ragChain = await createStuffDocumentsChain({ //rag chain to emulate chatbot behaviour
                llm,
                prompt,
                outputParser: new StringOutputParser(),
            });

            const retriever = vectorStore.asRetriever(); //initialzing retriever
            const retrievedDocs = await retriever.getRelevantDocuments(query); //running retriever to retrieve relevant documents
            console.log(">>>>>>>>>>>>>>>>>>", query, "=", retrievedDocs)

            const result = await ragChain.invoke({ //invoke the chain to return response
                question: query,
                context: vectorResult,
            });
                
            return { //returning response as a JSON object
                output: result
            };
        } catch (error) {
            console.error("Error uploading embeddings:", error);
            return { "success": false, "error": error }; //returning error as a JSON object
        }
    }
}

module.exports = QueryProcessor;
