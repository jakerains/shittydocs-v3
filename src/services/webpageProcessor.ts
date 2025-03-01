import { chat } from './llm';

async function extractWebpageContent(url: string): Promise<string> {
  try {
    try {
      new URL(url);
    } catch {
      throw new Error('Invalid URL format. Please enter a valid webpage URL.');
    }

    // Use Jina.ai's markdown parser
    const jinaUrl = `https://r.jina.ai/${encodeURIComponent(url)}`;
    const response = await fetch(jinaUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch webpage content. Please try again.');
    }

    const data = await response.json();
    
    // Extract content from Jina.ai response
    const content = data.content || data.text || '';
    
    if (!content || content.trim().length === 0) {
      throw new Error('No readable content found on that webpage. Try a different URL.');
    }

    return content;
  } catch (error) {
    console.error('Error extracting webpage content:', error);
    if (error instanceof Error && error.message) {
      throw error;
    }
    throw new Error('Failed to process the webpage. Please check the URL and try again.');
  }
}

export async function processWebpage(url: string): Promise<string> {
  try {
    let content = await extractWebpageContent(url);
    
    if (content.length > 50000) {
      // Trim content if it's too long to avoid AI model token limits
      content = content.slice(0, 50000) + '\n\n[Content truncated due to length...]';
    }
    
    const prompt = `You are ShittyDocs, a hilarious technical explainer. Take this webpage 
    content and rewrite it in your signature style. The output MUST be in markdown format:
    - Cut through the bullshit - no fancy jargon unless needed
    - Use creative swear words to emphasize points
    - Make it funny while keeping the important info
    - Structure it with clear markdown headings
    - Keep any important code examples or technical details
    
    Webpage content:
    ${content}`;

    const { content: text } = await chat(prompt, '');
    
    if (!text || text.trim().length === 0) {
      throw new Error('Failed to generate content. The AI returned an empty response.');
    }
    
    return text;
  } catch (error) {
    console.error('Webpage processing error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Something went wrong while processing the webpage. Please try again.');
  }
}