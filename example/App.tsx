import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text } from "react-native";

export default function App() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getGithubUsers().then((users) => setUsers(users));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
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
    return [];
  }
}
