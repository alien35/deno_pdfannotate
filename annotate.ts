import { PDFDocument, rgb, join } from "./deps.ts";

export async function addTextAnnotationsToPdf(
  pdfPath: string,
  annotations: Array<any>,
  options?: {
    output?: string;
  }
) {
  const pdfBytes = await Deno.readFile(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const outputFilePath = options?.output || join(Deno.cwd(), "annotated.pdf");

  annotations.forEach(annotation => {
    const page = pdfDoc.getPage(annotation.pageNumber - 1);
    
    if (annotation.type === 'text') {
      if (!annotation.content || typeof annotation.content !== 'string') return;
      page.drawText(annotation.content, {
        x: annotation.x,
        y: annotation.y,
        size: annotation.fontSize,
        color: rgb(0, 0, 0),
      });
    }
  });
  const modifiedPdfBytes = await pdfDoc.save();
  Deno.writeFileSync(outputFilePath, modifiedPdfBytes);

}