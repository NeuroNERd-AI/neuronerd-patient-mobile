import * as Speech from 'expo-speech';
export type VoiceState = 'idle'|'listening'|'processing'|'response'|'error';
export type VoiceService = { speak: (text: string, language?: string) => Promise<void> };
export const voiceService: VoiceService = { speak: (text, language = 'en-IN') => new Promise((resolve) => { Speech.speak(text, { language, onDone: () => resolve(), onError: () => resolve() }); }) };
export const voiceFallbackCopy = 'You can use the words on screen. Voice input is optional and is not needed to play.';
