import React, { useEffect, useState } from 'react';
import { BarChart, LineChart, PieChart, TrendingUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

declare global {
  interface Window {
    gtag: (
      command: 'get',
      targetId: string,
      fieldName: string,
      callback: (value: any) => void
    ) => void;
  }
}

export function Analytics() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalSearches: 0,
    randomSearches: 0,
    topicClicks: 0,
    avgSessionDuration: 0
  });

  useEffect(() => {
    // This is just a mock implementation since client-side GA4 data access is limited
    // In a real implementation, you'd need to use the GA4 API with proper authentication
    setTimeout(() => {
      setStats({
        totalSearches: 1234,
        randomSearches: 456,
        topicClicks: 789,
        avgSessionDuration: 245
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-[#6c412f] text-neutral-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100/90 rounded-3xl p-8 text-red-900">
            <h1 className="text-2xl font-bold mb-4">Error Loading Analytics</h1>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#6c412f] text-neutral-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-200 mb-6 flex items-center gap-3">
          <TrendingUp size={32} />
          Analytics Dashboard
        </h1>

        {isLoading ? (
          <div className="bg-amber-100/90 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500/30 border-t-amber-500"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-amber-100/90 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-amber-900 font-semibold">Total Searches</h3>
                  <LineChart className="text-amber-600" size={24} />
                </div>
                <p className="text-4xl font-bold text-amber-900">{stats.totalSearches}</p>
              </div>

              <div className="bg-amber-100/90 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-amber-900 font-semibold">Random Searches</h3>
                  <BarChart className="text-amber-600" size={24} />
                </div>
                <p className="text-4xl font-bold text-amber-900">{stats.randomSearches}</p>
              </div>

              <div className="bg-amber-100/90 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-amber-900 font-semibold">Topic Clicks</h3>
                  <PieChart className="text-amber-600" size={24} />
                </div>
                <p className="text-4xl font-bold text-amber-900">{stats.topicClicks}</p>
              </div>

              <div className="bg-amber-100/90 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-amber-900 font-semibold">Avg. Session (s)</h3>
                  <TrendingUp className="text-amber-600" size={24} />
                </div>
                <p className="text-4xl font-bold text-amber-900">{stats.avgSessionDuration}</p>
              </div>
            </div>

            {/* Documentation */}
            <div className="bg-amber-100/90 rounded-3xl p-8 shadow-2xl">
              <div className="prose prose-lg max-w-none text-gray-800">
                <ReactMarkdown>{`
# Analytics Guide

## Event Tracking
We track the following events:

### Search Events
- Manual searches (\`search\` event with \`search_type: 'manual'\`)
- Random searches (\`search\` event with \`search_type: 'random'\`)
- Topic clicks (\`topic_click\` event)

### Interaction Events
- Share actions (\`share\` event)
- Fullscreen toggles (\`toggle_fullscreen\` event)
- Downloads (\`download\` event)

### Navigation
- Page views (\`page_view\` event)

## Event Parameters
Each event includes:
- Timestamp
- User agent
- Screen resolution
- Viewport size
- Language preference
- Event-specific data (search terms, topics, etc.)

## Custom Dimensions
- Search type (manual/random)
- Topic categories
- Share methods
- Document types
                `}</ReactMarkdown>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}