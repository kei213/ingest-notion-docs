"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openai = void 0;
const llms_1 = require("langchain/llms");
if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OpenAI Credentials');
}
exports.openai = new llms_1.OpenAI({
    temperature: 0.4,
    maxTokens: 500,
});
//# sourceMappingURL=openai-client.js.map