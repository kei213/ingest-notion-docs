import express from 'express';
import { VectorDBQAChain } from 'langchain/chains';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { PineconeStore } from 'langchain/vectorstores';
import { openai } from './utils/openai-client.js';
import { pinecone } from './utils/pinecone-client.js';
// import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from './config/pinecone';
var PINECONE_INDEX_NAME = 'mobilemoneybw';

import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = 3000;



app.get('/', async (req, res) => {    
  const question  = "how do i setup an account"

  if (!question) {
    return res.status(400).json({ message: 'No question in the request' });
  }

  try {
    // OpenAI recommends replacing newlines with spaces for best results
    const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

    const index = pinecone.Index(PINECONE_INDEX_NAME);
    /* create vectorstore*/
    const vectorStore = await PineconeStore.fromExistingIndex(
      index,
      new OpenAIEmbeddings({}),
      'text',
      // PINECONE_NAME_SPACE, //optional
    );

    const model = openai;
    // create the chain
    const chain = VectorDBQAChain.fromLLM(model, vectorStore);

    //Ask a question
    const response = await chain.call({
      query: sanitizedQuestion,
    });

    console.log('response', response);

    res.status(200).json(response);
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: error?.message || 'Unknown error.' });
  }
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
