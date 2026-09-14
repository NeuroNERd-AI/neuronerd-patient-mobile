import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { clearPatientData, migrateDatabase, setState } from '../src/data/local/database';
import { getCurrentPatient } from '../src/data/remote/patientRepository';
import { flushOutbox, startSyncMonitor } from '../src/services/sync/coordinator';
import { Loading } from '../src/components/ui';
import { supabase } from '../src/services/auth/supabase';
import type { Profile } from '../src/types';

type AuthValue = { profile: Profile | null; setProfile: (profile: Profile | null) => void };
const AuthContext = createContext<AuthValue>({ profile: null, setProfile: () => undefined });
export const useAuth = () => useContext(AuthContext);
export default function RootLayout() { const [ready, setReady] = useState(false); const [profile, setProfile] = useState<Profile | null>(null); const segments = useSegments(); const router = useRouter();
  useEffect(() => { let active = true; const syncListener = startSyncMonitor(); migrateDatabase().then(async () => { const current = await getCurrentPatient(); if (active && current) { setProfile(current.profile); await setState('current_patient_id', current.patientId); void flushOutbox(); } }).finally(() => { if (active) setReady(true); }); const listener = supabase.auth.onAuthStateChange(async (event) => { if (event === 'SIGNED_OUT') { await clearPatientData(); if (active) setProfile(null); } }); return () => { active = false; syncListener(); listener.data.subscription.unsubscribe(); }; }, []);
  useEffect(() => { if (!ready) return; const inAuth = segments[0] === '(auth)'; if (!profile && !inAuth) router.replace('/(auth)/welcome'); if (profile && inAuth) router.replace('/(tabs)'); }, [ready, profile, segments, router]);
  if (!ready) return <Loading />;
  return <AuthContext.Provider value={{ profile, setProfile }}><View style={{ flex: 1 }}><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false }} /></View></AuthContext.Provider>;
}
