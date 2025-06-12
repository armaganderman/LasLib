import { SectionDescriptor, HeaderItem } from "../types";

/**
 * Converts the lines in a ~Well (or ~Other/Parameter) section to a HeaderItem array.
 *
lines: raw lines between section descriptor.startLine+1 and descriptor.endLine * 
 */
export function parseWellSection(
   desc: SectionDescriptor,
   lines: string[]
): HeaderItem[] {
   const items: HeaderItem[] = [];

   for (const raw of lines) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;  // skip empty and comment lines

      // Split the format "MNEM.UNIT VALUE : DESCRIPTION"
      const [left, ...descrParts] = line.split(":");
      const descr = descrParts.join(":").trim();

      // separate left part with space: ["MNEM.UNIT", "VALUE", "VALUE2", ...]
      const parts = left.trim().split(/\s+/);
      const mnemUnit = parts.shift()!;
      const [mnemonic, unit] = mnemUnit.split(".");
      const rawValue = parts.join(" ");

      // If the value is numeric, store it as number, otherwise store it as string
      const value = rawValue === ""
         ? ""
         : isNaN(Number(rawValue))
            ? rawValue
            : Number(rawValue);

      items.push({
         mnemonic,
         unit,
         value,
         descr
      });
   }

   return items;
}
