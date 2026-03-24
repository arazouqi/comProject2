import React, { useEffect, useState } from "react";
import { Alert, Button, FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import { API_BASE_URL } from "../../services/api";

type UserRole = "student" | "teacher" | "admin";

type UserItem = {
  id: number;
  username: string;
  role: UserRole;
};

type Props = {
  navigation: any;
};

export function AdminUsersScreen({ navigation }: Props) {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      Alert.alert("Error", "Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  }

useFocusEffect(
  React.useCallback(() => {
    fetchUsers();
  }, [])
);

  async function handleCreateUser() {
    if (!username.trim()) {
      Alert.alert("Missing info", "Please enter a username.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          role
        })
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.error || "Failed to create user.");
        return;
      }

      setUsers((prev) => [...prev, data]);
      setUsername("");
      setRole("student");
      Alert.alert("Success", "User created.");
    } catch (error) {
      console.error("Create user failed:", error);
      Alert.alert("Network Error", "Could not connect to server.");
    }
  }

  async function handleDeleteUser(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.error || "Failed to delete user.");
        return;
      }

      setUsers((prev) => prev.filter((user) => user.id !== id));
      Alert.alert("Success", "User deleted.");
    } catch (error) {
      console.error("Delete user failed:", error);
      Alert.alert("Network Error", "Could not connect to server.");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>
        Manage Users
      </Text>

      <View style={{ gap: 12, marginBottom: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>Create User</Text>

        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
        />

        <View style={{ borderWidth: 1, borderRadius: 10 }}>
          <Picker
            selectedValue={role}
            onValueChange={(itemValue) => setRole(itemValue as UserRole)}
          >
            <Picker.Item label="Student" value="student" />
            <Picker.Item label="Teacher" value="teacher" />
            <Picker.Item label="Admin" value="admin" />
          </Picker>
        </View>

        <Button title="Create User" onPress={handleCreateUser} />
      </View>

      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
        Existing Users
      </Text>

      {loading ? (
        <Text>Loading users...</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 12,
                borderWidth: 1,
                borderRadius: 10,
                marginBottom: 12,
                gap: 8
              }}
            >
              <Text style={{ fontWeight: "700" }}>{item.username}</Text>
              <Text>Role: {item.role}</Text>

              <Button
                title="Edit User"
                onPress={() => navigation.navigate("EditUser", { user: item })}
              />

              <Button
                title="View User Calendar"
                onPress={() => navigation.navigate("UserCalendar", { user: item })}
              />
              <Button
                title="Delete User"
                onPress={() => handleDeleteUser(item.id)}
              />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}