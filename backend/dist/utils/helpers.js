"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processMarkDownFiles = void 0;
const glob_1 = __importDefault(require("glob"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const document_1 = require("langchain/document");
async function processMarkDownFiles(directoryPath) {
    try {
        const fileNames = await (0, glob_1.default)('**/*.md', { cwd: directoryPath });
        console.log('files', fileNames);
        const docs = [];
        for (const fileName of fileNames) {
            const filePath = path_1.default.join(directoryPath, fileName);
            const text = await promises_1.default.readFile(filePath, {
                encoding: 'utf-8',
            });
            const metadata = { source: fileName };
            docs.push(new document_1.Document({
                pageContent: text,
                metadata,
            }));
        }
        console.log('docs', docs);
        return docs;
    }
    catch (error) {
        console.log('error', error);
        throw new Error(`Could not read directory path ${directoryPath} `);
    }
}
exports.processMarkDownFiles = processMarkDownFiles;
//# sourceMappingURL=helpers.js.map