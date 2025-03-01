import React, { useState } from 'react';
import { Info } from 'lucide-react';

export function About() {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#6c412f] text-neutral-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-200 mb-6 flex items-center gap-3">
          <Info size={32} />
          About ShittyDocs
        </h1>

        <div className="bg-amber-100/90 rounded-3xl p-8 shadow-2xl mb-8">
          <div className="prose prose-lg max-w-none text-gray-800">
            <h2 className="text-2xl font-bold text-amber-900 mb-6">Why I Made This Shit</h2>
            
            <div className="mb-8">
              <p className="text-center text-amber-900/70 mb-2">The tweet that started it all</p>
              <img
                src="/images/tweet.JPG"
                alt="Why ShittyDocs Exists"
                className="w-full max-w-md mx-auto rounded-xl shadow-lg mb-6 cursor-pointer hover:opacity-90 transition-opacity duration-200"
                onClick={() => setIsLightboxOpen(true)}
              />
            </div>

            {isLightboxOpen && (
              <div 
                className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                onClick={() => setIsLightboxOpen(false)}
              >
                <div className="relative max-w-7xl w-full">
                  <img
                    src="/images/tweet.JPG"
                    alt="Why ShittyDocs Exists"
                    className="w-full h-auto rounded-lg"
                  />
                  <button
                    className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full
                             hover:bg-black/70 transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLightboxOpen(false);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <p className="mb-4">
              Let's be real - technical documentation can be dry as fuck and hard to digest. 
              I created ShittyDocs because I was tired of wading through walls of formal, 
              boring-ass text just to learn something new.
            </p>

            <p className="mb-4">
              The idea is simple: explain complex shit in a way that's:
            </p>

            <ul className="list-disc pl-6 mb-6">
              <li>Straight to the fucking point</li>
              <li>Actually entertaining to read</li>
              <li>Easy to understand and remember</li>
              <li>Free of unnecessary technical jargon</li>
              <li>Written like a friend explaining it at a bar</li>
            </ul>

            <h3 className="text-xl font-bold text-amber-900 mb-4">The Philosophy</h3>

            <p className="mb-4">
              When you're learning something new, you don't need a PhD thesis - you need 
              someone to break it down in plain fucking English. That's what ShittyDocs is all about.
              We take complex topics and explain them like your genius best friend would after 
              a few drinks.
            </p>

            <h3 className="text-xl font-bold text-amber-900 mb-4">Features</h3>

            <ul className="list-disc pl-6 mb-6">
              <li>No-bullshit explanations of complex topics</li>
              <li>Convert boring docs into entertaining reads</li>
              <li>Quick, memorable learning experience</li>
              <li>Support for various document formats</li>
              <li>Mobile-friendly interface</li>
            </ul>

            <p>
              Whether you're a student, developer, or just someone trying to learn new shit,
              ShittyDocs is here to make the process less painful and more enjoyable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}