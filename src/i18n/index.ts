import type { Locale } from '../types';
export const translations: Record<Locale, Record<string, string>> = {
  en: { home: 'Home', games: 'Games', memories: 'Memories', reminders: 'Reminders', profile: 'Profile', hello: 'Hello, friend', today: 'A gentle day starts here.', play: 'Play a game', nextReminder: 'Next reminder', noReminder: 'You have a calm day ahead.', voice: 'Need help? You can ask me.', start: 'Start', save: 'Save', done: 'Done', addMemory: 'Add a memory', addReminder: 'Add a reminder', settings: 'Settings', signIn: 'Sign in', email: 'Email', password: 'Password' },
  hi: { home: 'होम', games: 'खेल', memories: 'यादें', reminders: 'याद दिलाने वाले', profile: 'प्रोफ़ाइल', hello: 'नमस्ते', today: 'आज का दिन यहाँ से शुरू करें।', play: 'खेल खेलें', start: 'शुरू करें', save: 'सहेजें', done: 'हो गया' },
  as: { home: 'ঘৰ', games: 'খেল', memories: 'স্মৃতি', reminders: 'মনত পেলোৱা', profile: 'প্ৰফাইল', hello: 'নমস্কাৰ', today: 'এটি শান্ত দিনৰ আৰম্ভণি।', play: 'এটা খেল খেলক', start: 'আৰম্ভ কৰক', save: 'সংৰক্ষণ', done: 'সম্পূৰ্ণ' },
  bn: { home: 'হোম', games: 'খেলা', memories: 'স্মৃতি', reminders: 'মনে করিয়ে দেওয়া', profile: 'প্রোফাইল', hello: 'নমস্কার', today: 'একটি শান্ত দিন এখান থেকে শুরু।', play: 'একটি খেলা খেলুন', start: 'শুরু করুন', save: 'সংরক্ষণ', done: 'হয়ে গেছে' },
};
export function t(locale: Locale, key: string) { return translations[locale]?.[key] ?? translations.en[key] ?? key; }
