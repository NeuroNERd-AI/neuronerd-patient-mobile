import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { Card, Heading, Button, OfflineBanner } from '../../src/components/ui';
import { listReminders, seedReminders } from '../../src/data/local/repositories';
import { markReminderCompleteOffline } from '../../src/services/notifications';
import type { Reminder } from '../../src/types';
import { styles } from '../../src/theme/tokens';
export default function Reminders() { const [items, setItems] = useState<Reminder[]>([]); useEffect(() => { seedReminders().then(() => listReminders().then(setItems)); }, []); async function complete(item: Reminder) { await markReminderCompleteOffline(item.id); setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, completedToday: true, syncState: 'queued' } : entry)); } return <SafeAreaView style={styles.screen}><ScrollView contentContainerStyle={styles.content}><Heading subtitle="Small steps, at your own pace.">Reminders</Heading><OfflineBanner />{items.map((item) => <Card key={item.id}><Text style={{ fontSize: 20, fontWeight: '800' }}>{item.title}</Text><Text>{item.message}</Text><Button title={item.completedToday ? 'Done today' : 'Mark done'} variant={item.completedToday ? 'secondary' : 'primary'} onPress={() => void complete(item)} /></Card>)}{!items.length ? <Card><Text>Nothing is planned yet.</Text></Card> : null}</ScrollView></SafeAreaView>; }
