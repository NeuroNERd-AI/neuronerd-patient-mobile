import { supabase } from '../../services/auth/supabase';
import type { Profile } from '../../types';
const client = supabase as any;
export async function getCurrentPatient(): Promise<{ profile: Profile; patientId: string } | null> { const { data: session } = await client.auth.getSession(); const authUserId = session.session?.user.id; if (!authUserId) return null; const { data: profile, error } = await client.from('profiles').select('id, auth_user_id, role, display_name, locale').eq('auth_user_id', authUserId).is('deleted_at', null).maybeSingle(); if (error || !profile || profile.role !== 'patient') return null; const { data: patient } = await client.from('patients').select('id').eq('profile_id', profile.id).is('deleted_at', null).maybeSingle(); if (!patient) return null; return { profile: { id: profile.id, authUserId: profile.auth_user_id, role: profile.role, displayName: profile.display_name ?? 'Friend', locale: (profile.locale as Profile['locale']) ?? 'en' }, patientId: patient.id }; }
export async function signIn(email: string, password: string) { return supabase.auth.signInWithPassword({ email, password }); }
export async function signOut() { return supabase.auth.signOut(); }
