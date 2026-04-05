import config from "../config/index.js";

function chunkText(
  text,
  chunkSize = config.chunkSize,
  overlap = config.chunkOverlap,
) {
  // Normalise whitespace
  const cleaned = text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (cleaned.length <= chunkSize) {
    return [cleaned];
  }

  const chunks = [];
  let start = 0;

  while (start < cleaned.length) {
    let end = start + chunkSize;

    if (end >= cleaned.length) {
      chunks.push(cleaned.slice(start).trim());
      break;
    }

    let boundary = findSentenceBoundary(cleaned, end);
    if (boundary === -1 || boundary <= start) {
      boundary = findWordBoundary(cleaned, end);
    }
    if (boundary === -1 || boundary <= start) {
      boundary = end;
    }

    chunks.push(cleaned.slice(start, boundary).trim());
    start = Math.max(boundary - overlap, start + 1);
  }

  return chunks.filter((c) => c.length > 0);
}

function findSentenceBoundary(text, near) {
  const window = text.slice(Math.max(0, near - 100), near + 1);
  const match = window.match(/[.!?\n\n][^.!?\n]*$/);
  if (!match) return -1;
  return near - (window.length - match.index) + 1;
}

function findWordBoundary(text, near) {
  for (let i = near; i > near - 50 && i > 0; i--) {
    if (text[i] === " ") return i;
  }
  return -1;
}

export { chunkText };
