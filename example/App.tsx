import * as Notifications from "expo-notifications";
import { useEffect, useState, useTransition } from "react";
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from "react-native";

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    requestPermissionsAsync();
  }, []);

  function handlePress() {
    startTransition(() => {
      getGithubUsers().then((users) => setUsers(users));
    });
  }

  return (
    <View style={styles.container}>
      <Button title="Do HTTP Request" onPress={handlePress} disabled={isPending} />
      {isPending && <ActivityIndicator />}
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <Text selectable style={[styles.text, { marginBottom: 8 }]}>
            {item.login}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 70,
    paddingBottom: 16,
    gap: 16,
    paddingHorizontal: 16,
  },
  text: {
    marginBottom: 16,
    marginHorizontal: 16,
    fontSize: 14,
    textAlign: "left",
  },
});

interface User {
  id: number;
  login: string;
  avatar_url: string;
  url: string;
}

async function getGithubUsers(): Promise<User[]> {
  try {
    const response = await fetch("https://api.github.com/users");

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    return response.json() as Promise<User[]>;
  } catch (e) {
    console.error(e);
    console.log(JSON.stringify(e, null, 2));
    return [];
  }
}

function requestPermissionsAsync() {
  return Notifications.requestPermissionsAsync();
}
