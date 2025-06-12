import { SectionDescriptor } from "./types";

export class LasFile {
   constructor(public sections: SectionDescriptor[]) { }
   // TODO: version, well, curves, data gibi property’ler
}