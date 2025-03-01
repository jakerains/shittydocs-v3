import { DOCUMENT_PROMPT } from '../config/systemPrompt';
import { getChatResponse } from './chat';
import mammoth from 'mammoth';
import * as PDFJS from 'pdfjs-dist';

// Initialize PDF.js worker
PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.js`;

export async function processDocument(file: File): Promise<string> {
  try {
    const text = await readFileContent(file);
    const prompt = `${DOCUMENT_PROMPT}\n\nDocument content:\n${text}`;
    return await getChatResponse(prompt);
  } catch (error) {
    console.error('Document processing error:', error);
    throw new Error('Failed to process that document. The shit hit the fan.');
  }
}

async function readFileContent(file: File): Promise<string> {
  if (file.type === 'text/plain' || file.type === 'text/markdown') {
    return await file.text();
  }
  
  // Handle Word documents
  if (file.type === 'application/msword' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  // Handle PDFs
  if (file.type === 'application/pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFJS.getDocument({ data: arrayBuffer }).promise;
    
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(' ') + '\n';
    }
    return text;
  }

  throw new Error('Unsupported file type. We support .txt, .md, .doc, .docx, and PDF files.');
}