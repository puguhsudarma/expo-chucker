import notifee, { AuthorizationStatus } from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";
import { useEffect, useState } from "react";

export function useNotificationPermission() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    Promise.all([
      messaging().requestPermission(),
      notifee.requestPermission(),
    ]).then(([authStatus, notifStatus]) => {
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      const localNotificationGranted =
        notifStatus.authorizationStatus === AuthorizationStatus.AUTHORIZED;

      console.log("Authorization status:", authStatus);
      console.log("Local notification status:", notifStatus);

      setEnabled(enabled && localNotificationGranted);
    });
  }, []);

  return enabled;
}
