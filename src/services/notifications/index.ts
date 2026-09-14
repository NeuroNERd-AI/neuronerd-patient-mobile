import * as Notifications from 'expo-notifications';
import { getDatabase } from '../../data/local/database';
import type { Reminder } from '../../types';
Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }) });
export async function requestNotificationPermission() { const current = await Notifications.getPermissionsAsync(); if (current.granted) return true; const next = await Notifications.requestPermissionsAsync(); return next.granted; }
export async function scheduleReminder(reminder: Reminder) { const permitted = await requestNotificationPermission(); if (!permitted) return null; const notificationId = await Notifications.scheduleNotificationAsync({ content: { title: reminder.title, body: reminder.message }, trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: new Date(reminder.startAt) } }); const db = await getDatabase(); await db.runAsync('UPDATE local_reminders SET notification_id = ? WHERE id = ?', notificationId, reminder.id); return notificationId; }
export async function markReminderCompleteOffline(reminderId: string) { const db = await getDatabase(); await db.runAsync("UPDATE local_reminders SET completed_today = 1, sync_state = 'queued' WHERE id = ?", reminderId); }
export async function cancelReminder(notificationId: string | null | undefined) { if (notificationId) await Notifications.cancelScheduledNotificationAsync(notificationId); }
