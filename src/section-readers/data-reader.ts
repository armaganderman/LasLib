import { SectionDescriptor, DataSection } from "../types";

/**
 * ~ASCII / ~Parses the data section.
 * @param desc      Section descriptor (for error messages only)
 * @param lines     Raw lines between desc.startLine+1 … desc.endLine
 * @param delimiter Which delimiter to split with ("SPACE" | "TAB" | "COMMA")
 */
export function parseDataSection(
   desc: SectionDescriptor,
   lines: string[],
   delimiter: "SPACE" | "TAB" | "COMMA" = "SPACE"
): DataSection {
   const rows: string[][] = [];

   for (const raw of lines) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;

      let tokens: string[];
      switch (delimiter) {
         case "TAB":
            tokens = line.split("\t");
            break;
         case "COMMA":
            tokens = line.split(",");
            break;
         default:
            tokens = line.split(/\s+/);
      }

      rows.push(tokens);
   }

   return { rows, delimiter };
}
