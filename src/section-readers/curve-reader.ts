import { SectionDescriptor, CurveItem } from "../types";

/**
 * ~Parsing Curves section.
 * @param desc  Description (for startLine/endLine info)
 * @param lines desc.startLine+1 … desc.endLine 
 * @returns     CurveItem array (mnemonic, unit, default value, description)
 */
export function parseCurveSection(
   desc: SectionDescriptor,
   lines: string[]
): CurveItem[] {
   const items: CurveItem[] = [];

   for (const raw of lines) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;

      // separate as "left : descr" 
      const [left, ...descrParts] = line.split(":");
      const descr = descrParts.join(":").trim();

      // split left part with space
      const parts = left.trim().split(/\s+/);

      // extract mnemonic and unit value
      let mnemonic = parts[0];
      let unit = "";
      let defaultValue = "";

      // If it is in "MNEM.UNIT" format
      if (mnemonic.includes(".")) {
         const [m, u] = mnemonic.split(".");
         mnemonic = m;
         unit = u;
         defaultValue = parts.slice(1).join(" ");
      }
      // Or if the second part is in ".UNIT" format
      else if (parts[1] && parts[1].startsWith(".")) {
         unit = parts[1].slice(1);
         defaultValue = parts.slice(2).join(" ");
      }
      // In other cases, only the value part is taken
      else {
         defaultValue = parts.slice(1).join(" ");
      }

      items.push({
         mnemonic,
         unit,
         value: defaultValue.trim(),
         descr
      });
   }

   return items;
}
