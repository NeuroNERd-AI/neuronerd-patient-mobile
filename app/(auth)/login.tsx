import { useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Field, Heading } from '../../src/components/ui';
import { colors, spacing } from '../../src/theme/tokens';
import { signIn, getCurrentPatient } from '../../src/data/remote/patientRepository';
import { useAuth } from '../_layout';
export default function Login() { const router = useRouter(); const { setProfile } = useAuth(); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false);
  async function submit() { setBusy(true); setMessage(''); const { error } = await signIn(email.trim(), password); if (error) setMessage('We could not sign you in. Please check your details and try again.'); else { const current = await getCurrentPatient(); if (current) { setProfile(current.profile); router.replace('/(tabs)'); } else setMessage('This account is not set up as a patient yet.'); } setBusy(false); }
  return <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream }}><View style={{ flex: 1, padding: spacing.lg, justifyContent: 'center', gap: spacing.lg }}><Heading subtitle="Your care team can help if you need your sign-in details.">Sign in</Heading><Field label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" /><Field label="Password" value={password} onChangeText={setPassword} placeholder="Your password" /><Text style={{ color: colors.coral }}>{message}</Text><Button title={busy ? 'Signing in…' : 'Sign in'} onPress={submit} disabled={busy || !email || !password} /><Button title="Go back" variant="quiet" onPress={() => router.back()} /></View></SafeAreaView>; }
