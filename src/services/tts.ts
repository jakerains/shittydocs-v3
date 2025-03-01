const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';
const VOICE_ID = 'NOpBlnGInO9m6vDvFkFC';

const introMessages = [
  "Hey y'all, PawPaw Jenkins here to read you some shit.",
  "Alright folks, PawPaw's got some knowledge to drop.",
  "Listen up, PawPaw's about to school you on this.",
  "Gather 'round, PawPaw's got some wisdom to share.",
  "Let old PawPaw break this down for ya.",
  "Y'all ready for PawPaw's explanation?"
];

// Clean up text for speech synthesis
function cleanTextForSpeech(text: string): string {
  // Remove markdown formatting
  text = text.replace(/[_*`]/g, '');
  
  // Remove URLs and links
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  text = text.replace(/https?:\/\/\S+/g, '');
  
  // Process headers and add pauses
  text = text.replace(/^#{1,6}\s+(.+)$/gm, (_, title) => {
    return `<break time="1.2s"/>${title}<break time="0.8s"/>`;
  });

  // Add pauses between paragraphs
  text = text.replace(/\n\n+/g, '\n<break time="1s"/>\n');
  
  // Add slight pauses for list items
  text = text.replace(/^[-*]\s+(.+)$/gm, (_, item) => {
    return `<break time="0.3s"/>${item}`;
  });
  
  return text;
}

export async function playText(text: string): Promise<{ audio: HTMLAudioElement; stop: () => void }> {
  try {
    // Validate API key
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (!apiKey || apiKey === 'your_elevenlabs_api_key') {
      throw new Error('ElevenLabs API key not configured');
    }

    // Get a random intro message
    const introMessage = introMessages[Math.floor(Math.random() * introMessages.length)];
    
    // Clean and prepare the text
    const cleanedText = cleanTextForSpeech(text);
    
    // Combine intro with cleaned text, adding SSML pause between
    const ssml = `<speak>
      ${introMessage}
      <break time="1.5s"/>
      ${cleanedText}
      <break time="1s"/>
    </speak>`;
    
    const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${VOICE_ID}/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: ssml,
        model_id: 'eleven_flash_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to generate speech');
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    // Start playing
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      await playPromise;
    }

    return {
      audio,
      stop: () => {
        audio.pause();
        audio.currentTime = 0;
        audio.src = '';
        URL.revokeObjectURL(audioUrl);
      }
    };
  } catch (error) {
    console.error('TTS error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to generate speech. Please check your API key and try again.');
  }
}