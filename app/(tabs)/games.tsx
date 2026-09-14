import { Link } from 'expo-router';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { Card, Heading, Button, StatusPill } from '../../src/components/ui';
import { gameLabels, GAME_KEYS, styles } from '../../src/theme/tokens';
export default function Games() { return <SafeAreaView style={styles.screen}><ScrollView contentContainerStyle={styles.content}><Heading subtitle="Take your time. There are no timers.">Games</Heading>{GAME_KEYS.map((key) => { const game = gameLabels[key]; return <Card key={key}><Text style={{ fontSize: 44 }}>{game.icon}</Text><Heading subtitle={game.subtitle}>{game.title}</Heading><StatusPill>Patient-paced</StatusPill><Link href={`/games/${key}`} asChild><Button title="Start" /></Link></Card>; })}<Text style={{ color: '#71685D', textAlign: 'center' }}>These activities show everyday activity, not clinical ability.</Text></ScrollView></SafeAreaView>; }
