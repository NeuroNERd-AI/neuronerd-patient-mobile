import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import type { Database } from '../../types/database';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://pwmrblijtqqzmuvqvvur.supabase.co';
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';
const storage = { getItem: (key: string) => SecureStore.getItemAsync(key), setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value), removeItem: (key: string) => SecureStore.deleteItemAsync(key) };
export const supabase = createClient<Database>(url, key, { auth: { storage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false } });
