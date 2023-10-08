import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as fs from "fs";

// Initialize the LLM to use for the LLMChain.
const model = new OpenAI({});

// Load the text from a file.
const text = fs.readFileSync("state_of_the_union.txt", "utf8");

// Create a vector store from the documents.
const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
const docs = await textSplitter.createDocuments([text]);
const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

// Create a prompt template.
const promptTemplate = PromptTemplate.fromTemplate(
  "Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.\n\n{context}\n\nQuestion: {question}\nAnswer:"
);

// Create an LLMChain with the vector store, model, and prompt template.
const chain = new LLMChain({
  vectorStore,
  llm: model,
  prompt: promptTemplate,
});