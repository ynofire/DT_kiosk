/**
 * Web Speech API TTS service specifically tailored for senior kiosk users
 */

let isAudioEnabled = true;

export function setAudioEnabled(enabled: boolean) {
  isAudioEnabled = enabled;
  if (!enabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function getAudioEnabled(): boolean {
  return isAudioEnabled;
}

export function speakText(text: string, onEnd?: () => void, lang: string = 'ko') {
  if (!isAudioEnabled) return;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    // Cancel any previous running speech
    window.speechSynthesis.cancel();

    // Clean text: remove special markdown or brackets that sound strange in TTS
    const cleanedText = text
      .replace(/\[.*?\]/g, '')
      .replace(/[①②③④]/g, '')
      .replace(/[#*~`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanedText) return;

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = lang === 'en' ? 'en-US' : 'ko-KR';
    utterance.rate = lang === 'en' ? 0.92 : 0.86; // Well-enunciated rate
    utterance.pitch = 1.0;
    utterance.volume = 1.0; // Clear and loud

    const voices = window.speechSynthesis.getVoices();
    if (lang === 'en') {
      const engVoice = voices.find(
        (v) => (v.lang.includes('en') || v.name.includes('English') || v.name.includes('Samantha') || v.name.includes('Google US English')) && !v.name.includes('Great Britain')
      );
      if (engVoice) {
        utterance.voice = engVoice;
      }
    } else {
      const koreanVoice = voices.find(
        (v) => v.lang.includes('ko') || v.name.includes('Korean') || v.name.includes('Yuna') || v.name.includes('Heami')
      );
      if (koreanVoice) {
        utterance.voice = koreanVoice;
      }
    }

    if (onEnd) {
      utterance.onend = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
