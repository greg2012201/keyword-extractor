import { encodingForModel } from "js-tiktoken";
import { mainPrompt, systemPrompt } from "./prompts";
import { MarkdownTextSplitter } from "@langchain/textsplitters";

async function getChunkedText(content: string, maxChunkSize: number = 2000) {
    const encoder = encodingForModel("gpt-4o-mini-2024-07-18");

    const chunkSize = maxChunkSize - encoder.encode(systemPrompt).length - encoder.encode(mainPrompt).length;
    const textSplitter = new MarkdownTextSplitter({
        chunkSize,

        lengthFunction: (text: string) => encoder.encode(text).length,
    });
    const texts = await textSplitter.splitText(content);

    return texts;
}

export default getChunkedText;
