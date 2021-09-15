import {
  basename,
  ensureDirSync,
  expandGlobSync,
  join,
  PDFDocument,
  PDFPage,
} from "./deps.ts";

export async function splitAll() {
  const globString = join(Deno.cwd(), "*.pdf");

  for (const pdf of expandGlobSync(globString)) {
    await splitPdf(pdf.path);
  }
}

export async function splitPdf(sourceFilePath: string) {
  const sourceFile = await PDFDocument.load(Deno.readFileSync(sourceFilePath));
  const filename = basename(sourceFilePath).replace(".pdf", "");
  const outputDir = join(Deno.cwd(), filename);

  const byteArrays: Promise<Uint8Array>[] = sourceFile.getPages().map(
    async (_: PDFPage, index: number) => {
      const doc = await PDFDocument.create();
      const [page] = await doc.copyPages(sourceFile, [index]);
      doc.addPage(page);
      return doc.save();
    },
  );
  await Promise.all(byteArrays).then((byteArray) => {
    byteArray.forEach((pdfBytes, i) => {
      ensureDirSync(outputDir);
      const outputFilePath = join(outputDir, `${filename}-${i + 1}.pdf`);
      Deno.writeFileSync(outputFilePath, pdfBytes);
    });
  });
}

if (import.meta.main) splitAll();
