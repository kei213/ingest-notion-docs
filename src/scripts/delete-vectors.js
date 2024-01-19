import { pinecone } from '../utils/pinecone-client.js';
import dotenv from 'dotenv'

// load env variables
dotenv.config();

const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

async function deleteVectors() {
	const pineconeResponse = await index.delete1({
	  deleteAll: true,
	  // namespace: "your_namespace_name"
	});

    console.log(pineconeResponse)
}


deleteVectors()