import messaging from "@react-native-firebase/messaging";
import { createLocalNotification } from "./create-local-notification";

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);

  await createLocalNotification(
    remoteMessage.notification?.title ?? "No title",
    remoteMessage.notification?.body ?? "No body"
  );
});
