import { encodingForModel, Tiktoken } from "js-tiktoken";
import { mainPrompt, systemPrompt } from "./prompts";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import zodToJsonSchema from "zod-to-json-schema";
import { keywordsResponseSchema } from "./schema";
import { type ZodType } from "zod";

function handleLimitError(
    { calculatedChunkSize, schemaString }: { calculatedChunkSize: number; schemaString: string },
    encoder: Tiktoken
) {
    if (calculatedChunkSize <= 0) {
        throw new Error(
            `maxChunkSize size is too small. Minimum maxChunkSize is ${
                encoder.encode(systemPrompt).length +
                encoder.encode(mainPrompt).length +
                encoder.encode(schemaString).length
            }`
        );
    }
}

function getSchemaAsString(schema: ZodType<any>) {
    const jsonSchema = zodToJsonSchema(schema);

    const schemaString = JSON.stringify(jsonSchema);

    return schemaString;
}

async function getChunkedText(content: string, maxChunkSize: number = 2000) {
    const encoder = encodingForModel("gpt-4o-mini-2024-07-18");
    const schemaString = getSchemaAsString(keywordsResponseSchema);
    const calculatedChunkSize =
        maxChunkSize -
        encoder.encode(systemPrompt).length -
        encoder.encode(mainPrompt).length -
        encoder.encode(schemaString).length;

    handleLimitError({ calculatedChunkSize, schemaString }, encoder);

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: calculatedChunkSize,

        lengthFunction: (text: string) => encoder.encode(text).length,
    });
    const texts = await textSplitter.splitText(content);

    return texts;
}

export default getChunkedText;
