import { SectionType } from "./types";

/**  
 * Regexp to normalize section titles  
 * Ex. "~Version" → key "V", "~Curves" → "C"  
 */
export const SECTION_HEADER_REGEX = /^~\s*([A-Za-z_]+)/;

/**  
 * Mapping of LAS section letter codes to SectionType  
 */
export const SECTION_TYPE_MAP: Record<string, SectionType> = {
   V: SectionType.Version,
   VERSION: SectionType.Version,
   W: SectionType.Well,
   WELL: SectionType.Well,
   P: SectionType.Params,
   PARAMETER: SectionType.Params,
   PARAMETERS: SectionType.Params,
   C: SectionType.Curves,
   CURVES: SectionType.Curves,
   O: SectionType.Other,
   OTHER: SectionType.Other,
   A: SectionType.Data,
   ASCII: SectionType.Data,
   LOG_DATA: SectionType.Data,
};
