// Type definition for the gtag function
declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'js',
      action: string,
      params?: Record<string, any>
    ) => void;
  }
}

// Track search queries
export function trackSearch(query: string) {
  window.gtag?.('event', 'search', {
    event_category: 'search',
    event_label: 'manual_search',
    search_term: query,
    search_type: 'manual',
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent,
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    viewport_size: `${window.innerWidth}x${window.innerHeight}`,
    language: navigator.language
  });
}

// Track topic button clicks
export function trackTopicClick(topic: string, prompt: string) {
  window.gtag?.('event', 'topic_click', {
    event_category: 'interaction',
    event_label: 'topic_selection',
    topic: topic,
    prompt: prompt,
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent
  });
}

// Track random searches
export function trackRandomSearch(prompt: string) {
  window.gtag?.('event', 'search', {
    event_category: 'search',
    event_label: 'random_search',
    search_term: prompt,
    search_type: 'random',
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent
  });
}

// Track document processing
export function trackDocumentProcess(fileType: string) {
  window.gtag?.('event', 'process_document', {
    event_category: 'document',
    event_label: 'document_processing',
    file_type: fileType,
    timestamp: new Date().toISOString()
  });
}

// Track webpage processing
export function trackWebpageProcess(url: string) {
  window.gtag?.('event', 'process_webpage', {
    event_category: 'webpage',
    event_label: 'webpage_processing',
    url: url,
    timestamp: new Date().toISOString()
  });
}

// Track content downloads
export function trackDownload(type: 'document' | 'webpage') {
  window.gtag?.('event', 'download', {
    event_category: 'download',
    event_label: `${type}_download`,
    content_type: type,
    timestamp: new Date().toISOString()
  });
}

// Track share events
export function trackShare(method: 'clipboard' | 'native') {
  window.gtag?.('event', 'share', {
    event_category: 'share',
    event_label: `${method}_share`,
    method: method,
    timestamp: new Date().toISOString()
  });
}

// Track fullscreen toggle
export function trackFullscreen(isFullscreen: boolean) {
  window.gtag?.('event', 'toggle_fullscreen', {
    event_category: 'interface',
    event_label: 'fullscreen_toggle',
    state: isFullscreen ? 'entered' : 'exited',
    timestamp: new Date().toISOString()
  });
}

// Track navigation
export function trackNavigation(path: string) {
  window.gtag?.('event', 'page_view', {
    event_category: 'navigation',
    event_label: 'page_navigation',
    page_path: path,
    timestamp: new Date().toISOString()
  });
}