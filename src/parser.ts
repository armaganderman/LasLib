import { SectionDescriptor } from "./types";
import { SECTION_HEADER_REGEX, SECTION_TYPE_MAP } from "./constants";

/**
 * raw: The entire text of the LAS file
 * returns: the beginning and ending lines of each ~-starting section
 */
export function parseSections(raw: string): SectionDescriptor[] {
   const lines = raw.split(/\r?\n/);
   const sections: SectionDescriptor[] = [];

   let current: SectionDescriptor | null = null;

   lines.forEach((line, idx) => {
      const match = line.match(SECTION_HEADER_REGEX);
      if (match) {
         // If a section is already open, set its endLine to the line before this one
         if (current) {
            current.endLine = idx - 1;
            sections.push(current);
         }

         // Start new section
         const headerToken = match[1].toUpperCase();               // e.g. "VERSION" or "V"
         const sectionType = SECTION_TYPE_MAP[headerToken]
            || (SECTION_TYPE_MAP[headerToken.split("_")[0]]);      // For cases like ~Log_Data
         if (!sectionType) {
            throw new Error(`Bilinmeyen LAS bölümü: ${headerToken} (satır ${idx + 1})`);
         }

         current = {
            header: headerToken,
            startLine: idx,
            endLine: lines.length - 1
         };
      }
   });

   // Add the last open section to the list
   if (current) {
      sections.push(current);
   }

   return sections;
}
