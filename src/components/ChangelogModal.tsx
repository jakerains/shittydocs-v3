import React from 'react';
import { X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { CHANGELOG } from '../config/changelog';

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangelogModal({ isOpen, onClose }: ChangelogModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#3c1f10] rounded-3xl max-w-2xl w-full max-h-[80vh] relative shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-amber-200/20 
                    hover:bg-amber-200/40 transition-all duration-200 
                    text-amber-200/90 hover:text-amber-200"
        >
          <X size={24} />
        </button>
        
        <div className="overflow-y-auto max-h-[80vh]">
          {/* Latest Release Section */}
          <div className="bg-[#3c1f10] p-8 border-b border-amber-900/20">
            <h2 className="text-2xl font-bold mb-4 text-amber-200">Latest Release</h2>
            <div className="prose prose-amber prose-lg max-w-none
                          prose-headings:text-amber-200 
                          prose-p:text-amber-200/90
                          prose-strong:text-amber-200
                          prose-a:text-amber-200/90 prose-a:no-underline hover:prose-a:text-amber-200
                          prose-img:inline prose-img:m-0 prose-img:align-middle prose-img:h-4
                          prose-li:text-amber-200/90">
              <ReactMarkdown>
                {CHANGELOG.split('## Previous Releases')[0].replace('# Changelog\n\n## ', '')}
              </ReactMarkdown>
            </div>
          </div>

          {/* Previous Releases Section */}
          <div className="p-8 text-amber-200">
            <h3 className="text-lg font-semibold mb-4 text-amber-200">Previous Releases</h3>
            <div className="prose prose-amber prose-sm max-w-none
                          prose-headings:text-amber-200
                          prose-p:text-amber-200/90
                          prose-li:text-amber-200/90">
              <ReactMarkdown>
                {CHANGELOG.split('## Previous Releases')[1]}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}