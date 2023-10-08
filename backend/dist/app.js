"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chains_1 = require("langchain/chains");
const embeddings_1 = require("langchain/embeddings");
const vectorstores_1 = require("langchain/vectorstores");
const openai_client_1 = require("./utils/openai-client");
const pinecone_client_1 = require("./utils/pinecone-client");
const pinecone_1 = require("./config/pinecone");
const app = (0, express_1.default)();
const port = 3000;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
app.get('/', async (req, res) => {
    const { question } = req.body;
    if (!question) {
        return res.status(400).json({ message: 'No question in the request' });
    }
    try {
        // OpenAI recommends replacing newlines with spaces for best results
        const sanitizedQuestion = question.trim().replaceAll('\n', ' ');
        const index = pinecone_client_1.pinecone.Index(pinecone_1.PINECONE_INDEX_NAME);
        /* create vectorstore*/
        const vectorStore = await vectorstores_1.PineconeStore.fromExistingIndex(index, new embeddings_1.OpenAIEmbeddings({}), 'text', pinecone_1.PINECONE_NAME_SPACE);
        const model = openai_client_1.openai;
        // create the chain
        const chain = chains_1.VectorDBQAChain.fromLLM(model, vectorStore);
        //Ask a question
        const response = await chain.call({
            query: sanitizedQuestion,
        });
        console.log('response', response);
        res.status(200).json(response);
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ error: error?.message || 'Unknown error.' });
    }
});
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map