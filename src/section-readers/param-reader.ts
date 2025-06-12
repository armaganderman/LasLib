import { SectionDescriptor, HeaderItem } from "../types";

/**
 * Parses the ~Parameter or ~Other sections.
 */
export function parseParamSection(
   desc: SectionDescriptor,
   lines: string[]
): HeaderItem[] {
   const items: HeaderItem[] = [];

   for (const raw of lines) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;

      // "LEFT : DESCRIPTION"
      const [left, ...descrParts] = line.split(":");
      const descr = descrParts.join(":").trim();

      const parts = left.trim().split(/\s+/);
      let mnemonic = parts[0];
      let unit = "";
      let rawValue = "";

      // If the second part is in ".UNIT" format
      if (parts[1] && parts[1].startsWith(".")) {
         unit = parts[1].slice(1);
         rawValue = parts.slice(2).join(" ");
      }
      // If the first part is in "MNEM.UNIT" format
      else if (mnemonic.includes(".")) {
         const [m, u] = mnemonic.split(".");
         mnemonic = m;
         unit = u;
         rawValue = parts.slice(1).join(" ");
      }
      // Other case: second part is value
      else {
         rawValue = parts.slice(1).join(" ");
      }

      const value =
         rawValue === ""
            ? ""
            : isNaN(Number(rawValue))
               ? rawValue
               : Number(rawValue);

      items.push({ mnemonic, unit, value, descr });
   }

   return items;
}
