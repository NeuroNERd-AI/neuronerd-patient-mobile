import * as Notifications from 'expo-notifications';
import type { Reminder } from '../../types';
Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }) });
export async function requestNotificationPermission() { const current = await Notifications.getPermissionsAsync(); if (current.granted) return true; const next = await Notifications.requestPermissionsAsync(); return next.granted; }
export async function scheduleReminder(reminder: Reminder) { const permitted = await requestNotificationPermission(); if (!permitted) return null; return Notifications.scheduleNotificationAsync({ content: { title: reminder.title, body: reminder.message }, trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: new Date(reminder.startAt) } }); }
