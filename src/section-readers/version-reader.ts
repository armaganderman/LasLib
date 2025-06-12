import { SectionDescriptor } from "../types";
import { VersionInfo } from "../types";

/**
 * Parses a ~Version section.
 */
export function parseVersionSection(
   desc: SectionDescriptor,
   lines: string[]
): VersionInfo {
   let version: number | undefined;
   let wrap: string | undefined;

   for (const raw of lines) {
      const line = raw.trim();
      if (!line) continue;

      // Get the version number
      const mVer = line.match(/([0-9]+(?:\.[0-9]+)+)/);
      if (mVer && version === undefined) {
         version = parseFloat(mVer[1]);
      }

      // Get wrap information (WRAP. line)
      const mWrap = line.match(/^WRAP\.?\s+([^:]+)/i);
      if (mWrap) {
         wrap = mWrap[1].trim();
      }
   }

   if (version === undefined) {
      throw new Error(`Could not read version number from ~Version section (line ${desc.startLine + 1})`);
   }

   return { version, wrap };
}


