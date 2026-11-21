/** A file in an archive, independent of the custom card's file formats. */
export interface ArchiveFile {
  /** Relative path inside the ZIP, including any parent folders. */
  path: string;
  content: Uint8Array;
}

/** Extracts a custom card's files from an uploaded ZIP. */
export interface CustomCardImporter {
  importZip(zip: Blob): Promise<ArchiveFile[]>;
}

/** Packages a custom card's files into a ZIP for download. */
export interface CustomCardExporter {
  exportZip(files: readonly ArchiveFile[]): Promise<Blob>;
}



//TODO Implementation of Interface using JSZip and fs/promises to read and write ZIP files. 
//This serves as a template we can use in the future

// import JSZip from "jszip";
// import fs from "fs/promises";

// async function readZip() {
//     const data = await fs.readFile("data.zip");

//     const zip = await JSZip.loadAsync(data);

//     for (const [filename, file] of Object.entries(zip.files)) {
//         if (!file.dir && filename.endsWith(".json")) {

//             // Read the JSON as a string
//             const jsonString = await file.async("string");

//             // Convert the string into an object
//             const object = JSON.parse(jsonString);

//             console.log(filename, object);
//         }
//     }
// }

// readZip();


