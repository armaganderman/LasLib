import { parseSections } from "./parser";
import { LasFile } from "./las-file";

export async function readFromString(raw: string): Promise<LasFile> {
   const sections = parseSections(raw);
   return new LasFile(sections);
}
