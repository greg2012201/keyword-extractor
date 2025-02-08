import * as fs from "node:fs";

export function loadTextFromFile() {
    return fs.readFileSync("./text.txt", "utf-8");
}
