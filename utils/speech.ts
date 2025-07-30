export const speak = (text: string) => {
  if ('speechSynthesis' in window) {
    // Cancel any previous speech to avoid overlap
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;

    const voices = window.speechSynthesis.getVoices();
    // Try to find a female voice. The names are browser-dependent.
    const femaleVoice = voices.find(voice => 
      voice.lang.startsWith('en-') && 
      (
        voice.name.includes('Female') || 
        voice.name.includes('Zira') || 
        voice.name.includes('Samantha') ||
        voice.name.includes('Google US English') // Often a good female voice
      )
    );

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    // If a specific female voice isn't found, the browser will use its default for 'en-US'.

    window.speechSynthesis.speak(utterance);
  } else {
    alert("Sorry, your browser doesn't support text-to-speech.");
  }
};