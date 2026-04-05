import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";

async function parseDocument(buffer, mimeType) {
  switch (mimeType) {
    case "text/plain":
      return buffer.toString("utf-8");

    case "application/pdf":
      return parsePDF(buffer);

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    case "application/msword":
      return parseDocx(buffer);

    default:
      throw new Error(`Unsupported file type: ${mimeType}`);
  }
}

async function parsePDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (err) {
    throw new Error(`Failed to parse PDF: ${err.message}`);
  }
}

async function parseDocx(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (err) {
    throw new Error(`Failed to parse DOCX: ${err.message}`);
  }
}

export { parseDocument };
