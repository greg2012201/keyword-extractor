import "dotenv/config";
import { loadTextFromFile } from "./utils";
import getChunkedText from "./get-chunked-text";
import { mainPrompt, systemPrompt } from "./prompts";
import { ChatOpenAI } from "@langchain/openai";
import { keywordsResponseSchema } from "./schema";

const model = new ChatOpenAI({
    model: "gpt-4o-mini-2024-07-18",
    temperature: 0,
    apiKey: process.env.OPENAI_API_KEY,
});

export async function callLlm() {
    const text = loadTextFromFile();
    const textChunks = await getChunkedText(text);
    const structured = model.withStructuredOutput(keywordsResponseSchema);
    const completions = await Promise.all(
        textChunks.map(async (chunk) => {
            console.log("sending prompt...");
            return structured.invoke([
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: mainPrompt + chunk,
                },
            ]);
        })
    );

    const results = completions
        .flatMap((completion) => completion.results)
        .filter((result) => result.confidence >= 0.85)
        .map((result) => result.keyword);
    return [...new Set(results)];
}
