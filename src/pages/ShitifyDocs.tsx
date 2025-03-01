import React, { useState, useRef } from 'react';
import { FileText, Upload, Download } from 'lucide-react';
import { processDocument } from '../services/documentProcessor';
import { trackDocumentProcess, trackDownload } from '../services/analytics';
import ReactMarkdown from 'react-markdown';

export function ShitifyDocs() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError('');
    setIsProcessing(true);
    setProcessingStep('Reading that shit...');

    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Let first message show
      setProcessingStep('Converting boring-ass content...');
      const processedContent = await processDocument(selectedFile);
      setProcessingStep('Making this shit readable...');
      await new Promise(resolve => setTimeout(resolve, 600)); // Let final message show
      setResult(processedContent);
      trackDocumentProcess(selectedFile.type);
    } catch (err) {
      setError((err as Error).message);
      setResult('');
    } finally {
      setProcessingStep('');
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    trackDownload('document');

    const blob = new Blob([result], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shitified-${file?.name || 'document'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#6c412f] text-neutral-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-200 mb-6 flex items-center gap-3">
          <FileText size={32} />
          Shitify Your Docs
        </h1>

        <div className="bg-amber-100/90 rounded-3xl p-8 shadow-2xl mb-8">
          <p className="text-gray-800 mb-6">
            Upload your boring-ass documentation, and we'll translate it into our signature ShittyDocs style.
            We support .txt, .md, .doc, .docx, and PDF files.
          </p>

          <div className="flex flex-col items-center justify-center border-2 border-dashed border-amber-300/30 rounded-xl p-8 bg-amber-50/50">
            {isProcessing && (
              <div className="mb-6 flex items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-amber-500/30 border-t-amber-500"></div>
                <p className="text-gray-800 font-medium">{processingStep}</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept=".txt,.md,.doc,.docx,.pdf"
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-3 px-6 py-3 bg-amber-500 text-white rounded-xl
                       hover:bg-amber-600 active:bg-amber-700 transition-all duration-200
                       shadow-lg hover:shadow-xl"
              disabled={isProcessing}
            >
              <Upload size={20} />
              {isProcessing ? 'Processing...' : 'Upload Document'}
            </button>

            {file && (
              <p className="mt-4 text-gray-600">
                Selected: {file.name}
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-amber-100/90 rounded-3xl p-8 shadow-2xl relative">
            <button
              onClick={handleDownload}
              className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 
                       bg-amber-500 text-white rounded-lg shadow-md
                       hover:bg-amber-600 transition-all duration-200"
            >
              <Download size={18} />
              Download
            </button>

            <div className="prose prose-lg max-w-none">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}