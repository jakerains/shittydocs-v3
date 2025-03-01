import React, { useState } from 'react';
import { Globe, ArrowRight, Download } from 'lucide-react';
import { processWebpage } from '../services/webpageProcessor';
import { trackWebpageProcess, trackDownload } from '../services/analytics';
import ReactMarkdown from 'react-markdown';

export function ShitifyWebpage() {
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setError('');
    setIsProcessing(true);
    setProcessingStep('Scraping that webpage like a boss...');

    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Let first message show
      setProcessingStep('Extracting the good shit...');
      const processedContent = await processWebpage(url);
      setProcessingStep('Making it not suck...');
      await new Promise(resolve => setTimeout(resolve, 600)); // Let final message show
      setResult(processedContent);
      trackWebpageProcess(url);
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
    trackDownload('webpage');

    const blob = new Blob([result], { type: 'text/markdown' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `shitified-webpage.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div className="min-h-screen bg-[#6c412f] text-neutral-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-200 mb-6 flex items-center gap-3">
          <Globe size={32} />
          Shitify a Webpage
        </h1>

        <div className="bg-amber-100/90 rounded-3xl p-8 shadow-2xl mb-8">
          <p className="text-gray-800 mb-6">
            Paste in any webpage URL, and we'll rewrite that shit in our signature style.
            Perfect for making boring documentation actually readable.
          </p>

          <form onSubmit={handleSubmit} className="flex gap-4">
            {isProcessing && (
              <div className="absolute -top-14 left-0 right-0 flex items-center justify-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-amber-500/30 border-t-amber-500"></div>
                <p className="text-gray-800 font-medium">{processingStep}</p>
              </div>
            )}
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 px-4 py-2 rounded-xl bg-amber-50/50 text-gray-800 
                       border-2 border-amber-300/30 focus:border-amber-400
                       outline-none transition-colors duration-200"
              required
            />
            <button
              type="submit"
              disabled={isProcessing}
              className="flex items-center gap-2 px-6 py-2 bg-amber-500 text-white rounded-xl
                       hover:bg-amber-600 active:bg-amber-700 transition-all duration-200
                       shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  Shitify
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
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