import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { API_BASE_URL } from "../../services/api";

type UserRole = "student" | "teacher" | "admin";

type Props = {
  route: {
    params: {
      user: {
        id: number;
        username: string;
        role: UserRole;
      };
    };
  };
  navigation: any;
};

export function EditUserScreen({ route, navigation }: Props) {
  const { user } = route.params;

  const [username, setUsername] = useState(user.username);
  const [role, setRole] = useState<UserRole>(user.role);

  async function handleUpdateUser() {
    if (!username.trim()) {
      Alert.alert("Missing info", "Please enter a username.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${user.id}`, {
        method: "PUT",
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
        Alert.alert("Error", data.error || "Failed to update user.");
        return;
      }

      Alert.alert("Success", "User updated successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("Update user failed:", error);
      Alert.alert("Network Error", "Could not connect to server.");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>
        Edit User
      </Text>

      <View style={{ gap: 12 }}>
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

        <Button title="Save Changes" onPress={handleUpdateUser} />
      </View>
    </SafeAreaView>
  );
}