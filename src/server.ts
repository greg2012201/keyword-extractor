import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { callLlm } from "./kewyords-extractor";
import "dotenv/config";

const app = new Hono();

app.use("/*", cors());

app.get("/", async (c) => {
    try {
        const results = await callLlm();
        return c.json(results);
    } catch (error) {
        console.error(error);
        return c.json({ error: "Internal server error" }, 500);
    }
});

serve(app);
export default app;
