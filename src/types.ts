/**  
 * Each section in the LAS file (e.g. ~V, ~W, ~C etc.)
 * Represents a section descriptor with its header and line range. 
 */
export interface SectionDescriptor {
   /** Raw header like "~V" or "~Version". */
   header: string;
   /** 0-based line number */
   startLine: number;
   /** 0-based line number (inclusive) */
   endLine: number;
}

/**  
 * Enum representing LAS 2.0 / 3.0 partitions  
 */
export enum SectionType {
   Version = "Version",
   Well = "Well",
   Curves = "Curves",
   Params = "Params",
   Other = "Other",
   Data = "Data",
}

/**  
 * Information to be parsed from the Version section  
 */
export interface VersionInfo {
   version: number;
   wrap?: string;
}

/**  
 * Object of each line in ~Well, ~Parameter, ~Other sections  
 */
export interface HeaderItem {
   mnemonic: string;
   unit: string;
   value: string | number;
   descr: string;
}

/**  
 * ~Each curve definition in the Curves section  
 */
export interface CurveItem extends HeaderItem { }

/**  
 * ~ASCII / ~Log data in the Data section  
 */
export interface DataSection {
   /** Raw data row by row (each row is an array) */
   rows: Array<Array<number | string>>;
   /** Which delimiter was used? */
   delimiter: "SPACE" | "TAB" | "COMMA";
}

/**  
 * All parsed contents of LasFile class
 */
export interface LasContent {
   version: VersionInfo;
   well: HeaderItem[];
   curves: CurveItem[];
   params: HeaderItem[];
   other: HeaderItem[];
   data: DataSection;
}
