import notifee from "@notifee/react-native";

export async function createLocalNotification(title: string, body: string) {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: "high-priority",
    name: "High Priority Notifications",
  });

  // Display a notification
  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId,
    },
  });
}
