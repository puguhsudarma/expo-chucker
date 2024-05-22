import { FlatList, SafeAreaView, StyleSheet, Text } from "react-native";
import { useDeviceToken } from "./hooks/use-device-token";
import { useGithubUsers } from "./hooks/use-github-user";
import { useNotificationPermission } from "./hooks/use-notification-permission";
import "./utils/set-background-notification-handler";

export default function App() {
  const isPermissionGranted = useNotificationPermission();
  const deviceToken = useDeviceToken(isPermissionGranted);
  const users = useGithubUsers(isPermissionGranted);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text} selectable>
        {isPermissionGranted
          ? "Notification permission granted"
          : "No notification permission"}
      </Text>

      <Text style={styles.text} selectable>
        {deviceToken ? `Device token: ${deviceToken}` : "No device token"}
      </Text>

      <FlatList
        data={users}
        renderItem={({ item }) => (
          <Text selectable style={[styles.text, { marginBottom: 8 }]}>
            {item.login}
          </Text>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  text: {
    marginBottom: 16,
    marginHorizontal: 16,
    fontSize: 14,
    textAlign: "left",
  },
});
