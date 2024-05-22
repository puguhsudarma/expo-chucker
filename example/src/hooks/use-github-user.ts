import { useEffect, useState } from "react";

export interface User {
  id: number;
  login: string;
  avatar_url: string;
  url: string;
}

export const getGithubUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch("https://api.github.com/users");
    const users = await response.json();
    return users as User[];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const useGithubUsers = (enabled: boolean = true) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    getGithubUsers().then((users) => setUsers(users));
  }, [enabled]);

  return users;
};
