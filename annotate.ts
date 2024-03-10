import { PDFDocument, rgb, join } from "./deps.ts";

async function addTextAnnotationsToPdf(
  pdfPath: string,
  annotations: Array<any>,
  options?: {
    output?: string;
  }
) {
  // Load the existing PDF document
  const pdfBytes = await Deno.readFile(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const outputFilePath = options?.output || join(Deno.cwd(), "annotated.pdf");

  // Process each annotation
  annotations.forEach(annotation => {
    const page = pdfDoc.getPage(annotation.pageNumber - 1);
    
    if (annotation.type === 'text') {
      // Ensure required properties are present
      if (!annotation.content || typeof annotation.content !== 'string') return;
      
      // Add text annotation
      page.drawText(annotation.content, {
        x: annotation.x,
        y: annotation.y, // Adjust based on your coordinate system
        size: annotation.fontSize,
        color: rgb(0, 0, 0), // Adjust as needed or based on annotation properties
        // Include other properties as needed
      });
    }

    // Include logic for other annotation types (e.g., image)
  });

  // Save the modified PDF
  const modifiedPdfBytes = await pdfDoc.save();
  Deno.writeFileSync(outputFilePath, modifiedPdfBytes);

}