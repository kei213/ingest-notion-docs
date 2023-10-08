"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const text_splitter_1 = require("langchain/text_splitter");
const embeddings_1 = require("langchain/embeddings");
const vectorstores_1 = require("langchain/vectorstores");
const pinecone_client_1 = require("@/utils/pinecone-client");
const helpers_1 = require("@/utils/helpers");
const pinecone_1 = require("@/config/pinecone");
/* Name of directory to retrieve files from. You can change this as required */
const directoryPath = 'Notion_DB';
const run = async () => {
    try {
        /*load raw docs from the markdown files in the directory */
        const rawDocs = await (0, helpers_1.processMarkDownFiles)(directoryPath);
        /* Split text into chunks */
        const textSplitter = new text_splitter_1.RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const docs = await textSplitter.splitDocuments(rawDocs);
        console.log('split docs', docs);
        console.log('creating vector store...');
        /*create and store the embeddings in the vectorStore*/
        const embeddings = new embeddings_1.OpenAIEmbeddings();
        const index = pinecone_client_1.pinecone.Index(pinecone_1.PINECONE_INDEX_NAME); //change to your own index name
        await vectorstores_1.PineconeStore.fromDocuments(index, docs, embeddings, 'text', pinecone_1.PINECONE_NAME_SPACE);
    }
    catch (error) {
        console.log('error', error);
        throw new Error('Failed to ingest your data');
    }
};
exports.run = run;
(async () => {
    await (0, exports.run)();
    console.log('ingestion complete');
})();
//# sourceMappingURL=ingest-data.js.map