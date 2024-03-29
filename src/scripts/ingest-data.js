import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { OpenAIEmbeddings } from 'langchain/embeddings'
import { PineconeStore } from 'langchain/vectorstores'
import { pinecone } from '../utils/pinecone-client.js'
import { processMarkDownFiles } from '../utils/helpers.js'
import dotenv from 'dotenv'

// load env variables
dotenv.config();

/* Name of directory to retrieve files from. You can change this as required */
const directoryPath = 'Notion_DB'

var PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME

export const run = async () => {
  try {
    /*load raw docs from the markdown files in the directory */
    const rawDocs = await processMarkDownFiles(directoryPath);

    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);
    
    console.log("uploading vectors...")
    /*create and store the embeddings in the vectorStore*/
    const embeddings = new OpenAIEmbeddings();
    const index = pinecone.Index(PINECONE_INDEX_NAME); //change to your own index name
    await PineconeStore.fromDocuments(
      index,
      docs,
      embeddings,
      'text',
      /*PINECONE_NAME_SPACE*///optional namespace for your vectors
    );
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to ingest your data');
  }
};

(async () => {
  await run();
  console.log('ingestion complete');
})();
