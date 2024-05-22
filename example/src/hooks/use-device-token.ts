import messaging from "@react-native-firebase/messaging";
import { useEffect, useState } from "react";

export const useDeviceToken = (enabled: boolean = true) => {
  const [deviceToken, setDeviceToken] = useState<string>();

  useEffect(() => {
    messaging()
      .registerDeviceForRemoteMessages()
      .then(async () => {
        const token = await messaging().getToken();

        if (token) {
          console.log("Device token:", token);
          setDeviceToken(token);
        }
      });
  }, [enabled]);

  return deviceToken;
};
