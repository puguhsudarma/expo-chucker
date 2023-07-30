import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

interface User {
  id: number;
  login: string;
  avatar_url: string;
  url: string;
}

const getGithubUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch("https://api.github.com/users");
    const users = await response.json();
    return users as User[];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export default function App() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getGithubUsers().then((users) => setUsers(users));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={({ item }) => <Text>{item.login}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
