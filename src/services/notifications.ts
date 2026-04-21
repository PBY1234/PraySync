import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) return null;

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('praysync', {
      name: 'PraySync',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#d4af37',
    });
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}

export async function scheduleDailyReminders(): Promise<void> {
  // Cancelar todas las notificaciones previas para evitar duplicados
  await Notifications.cancelAllScheduledNotificationsAsync();

  // 07:00 — Rosario de mañana
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Buenos días 🌅',
      body: 'Ya hay más de 47.000 personas rezando el Rosario. ¿Te unes?',
      sound: true,
    },
    trigger: {
      hour: 7,
      minute: 0,
      repeats: true,
    } as Notifications.DailyTriggerInput,
  });

  // 12:00 — Ángelus
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'El Ángelus 🕊️',
      body: 'Mediodía. Miles de fieles se unen en oración ahora mismo.',
      sound: true,
    },
    trigger: {
      hour: 12,
      minute: 0,
      repeats: true,
    } as Notifications.DailyTriggerInput,
  });

  // 19:00 — Rosario vespertino
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Momento de paz 🌹',
      body: 'Es la hora del Rosario vespertino. Únete a la comunidad mundial.',
      sound: true,
    },
    trigger: {
      hour: 19,
      minute: 0,
      repeats: true,
    } as Notifications.DailyTriggerInput,
  });
}

export async function scheduleWeeklyPapalMessage(): Promise<void> {
  // Domingo a las 12:00 — mensaje especial del Papa
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'El Papa reza el Rosario ahora 🙏',
      body: 'El Santo Padre está rezando. Millones de católicos se unen en este momento.',
      sound: true,
    },
    trigger: {
      weekday: 1, // Domingo
      hour: 12,
      minute: 0,
      repeats: true,
    } as Notifications.WeeklyTriggerInput,
  });
}
