import { readFileSync } from "fs";
import {
   LasContent,
   DataSection,
   HeaderItem,
   CurveItem,
   VersionInfo
} from "./types";
import { parseSections } from "./parser";
import { parseVersionSection } from "./section-readers/version-reader";
import { parseWellSection } from "./section-readers/well-reader";
import { parseCurveSection } from "./section-readers/curve-reader";
import { parseParamSection } from "./section-readers/param-reader";
import { parseDataSection } from "./section-readers/data-reader";

export class LasFile implements LasContent {
   version: VersionInfo;
   well: HeaderItem[];
   curves: CurveItem[];
   params: HeaderItem[];
   other: HeaderItem[];
   data: DataSection;

   constructor(raw: string) {
      const sections = parseSections(raw);
      const lines = raw.split(/\r?\n/);

      // Version
      const vDesc = sections.find(s => s.header.startsWith("V"));
      if (!vDesc) throw new Error("~Version section not found");
      this.version = parseVersionSection(
         vDesc,
         lines.slice(vDesc.startLine + 1, vDesc.endLine + 1)
      );

      // Well
      const wDesc = sections.find(s => s.header.startsWith("W"));
      if (!wDesc) throw new Error("~Well section not found");
      this.well = parseWellSection(
         wDesc,
         lines.slice(wDesc.startLine + 1, wDesc.endLine + 1)
      );

      // Curves
      const cDesc = sections.find(s => s.header.startsWith("C"));
      if (!cDesc) throw new Error("~Curves section not found");
      this.curves = parseCurveSection(
         cDesc,
         lines.slice(cDesc.startLine + 1, cDesc.endLine + 1)
      );

      // Params (optional)
      const pDesc = sections.find(s => s.header.startsWith("P"));
      this.params = pDesc
         ? parseParamSection(
            pDesc,
            lines.slice(pDesc.startLine + 1, pDesc.endLine + 1)
         )
         : [];

      // Other (optional)
      const oDesc = sections.find(s => s.header.startsWith("O"));
      this.other = oDesc
         ? parseParamSection(
            oDesc,
            lines.slice(oDesc.startLine + 1, oDesc.endLine + 1)
         )
         : [];

      // Data
      const dDesc = sections.find(s => s.header.startsWith("A"));
      if (!dDesc) throw new Error("~ASCII/Data section not found");
      this.data = parseDataSection(
         dDesc,
         lines.slice(dDesc.startLine + 1, dDesc.endLine + 1),
         "SPACE"
      );
   }

   static fromFile(path: string): LasFile {
      const raw = readFileSync(path, { encoding: "utf-8" });
      return new LasFile(raw);
   }

   getCurve(mnemonic: string): Array<number | string> | undefined {
      const idx = this.curves.findIndex(c => c.mnemonic === mnemonic);
      if (idx < 0) return undefined;
      return this.data.rows.map(row => {
         const cell = row[idx];
         const num = Number(cell);
         return isNaN(num) ? cell : num;
      });
   }
}
