"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pinecone = void 0;
const pinecone_1 = require("@pinecone-database/pinecone");
console.log(process.env.PINECONE_ENVIRONMENT);
if (!process.env.PINECONE_ENVIRONMENT || !process.env.PINECONE_API_KEY) {
    throw new Error('Pinecone environment or api key vars missing');
}
async function initPinecone() {
    try {
        const pinecone = new pinecone_1.PineconeClient();
        await pinecone.init({
            environment: process.env.PINECONE_ENVIRONMENT ?? '',
            apiKey: process.env.PINECONE_API_KEY ?? '',
        });
        return pinecone;
    }
    catch (error) {
        console.log('error', error);
        throw new Error('Failed to initialize Pinecone Client');
    }
}
exports.pinecone = await initPinecone();
//# sourceMappingURL=pinecone-client.js.map