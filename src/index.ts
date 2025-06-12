import { readFileSync } from "fs";
import { LasFile } from "./las-file";

/**
 * Takes the raw text and creates a LasFile object.
 */
export function readFromString(raw: string): LasFile {
   return new LasFile(raw);
}

/**
 * Read from file path and create LasFile object.
 */
export function readFromFile(path: string): LasFile {
   const raw = readFileSync(path, { encoding: "utf-8" });
   return new LasFile(raw);
}
