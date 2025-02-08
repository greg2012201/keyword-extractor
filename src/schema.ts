import { z } from "zod";

export const keywordsResponseSchema = z.object({
    results: z.array(z.object({ keyword: z.string(), confidence: z.number() })),
});
