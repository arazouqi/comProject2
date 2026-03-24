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
        name: string;
        email: string;
        password: string;
        role: UserRole;
        classGroup: string;
      };
    };
  };
  navigation: any;
};

export function EditUserScreen({ route, navigation }: Props) {
  const { user } = route.params;

  const [username, setUsername] = useState(user.username);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.password);
  const [role, setRole] = useState<UserRole>(user.role);
  const [classGroup, setClassGroup] = useState(user.classGroup);

  async function handleUpdateUser() {
    if (!username.trim() || !name.trim() || !email.trim() || !password.trim() || !classGroup.trim()) {
      Alert.alert("Missing info", "Please fill in all fields.");
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
          name,
          email,
          password,
          role,
          classGroup
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

        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
        />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
        />

        <View style={{ borderWidth: 1, borderRadius: 10 }}>
          <Picker
            selectedValue={classGroup}
            onValueChange={(itemValue) => setClassGroup(itemValue)}
          >
            <Picker.Item label="Select class group..." value="" />
            <Picker.Item label="Computer Science - Year 1" value="computer-science-year-1" />
            <Picker.Item label="Computer Science - Year 2" value="computer-science-year-2" />
            <Picker.Item label="Computer Science - Year 3" value="computer-science-year-3" />
            <Picker.Item label="Mathematics - Year 1" value="mathematics-year-1" />
            <Picker.Item label="Mathematics - Year 2" value="mathematics-year-2" />
            <Picker.Item label="Mathematics - Year 3" value="mathematics-year-3" />
            <Picker.Item label="Psychology - Year 1" value="psychology-year-1" />
            <Picker.Item label="Psychology - Year 2" value="psychology-year-2" />
            <Picker.Item label="Psychology - Year 3" value="psychology-year-3" />
            <Picker.Item label="Business - Year 1" value="business-year-1" />
            <Picker.Item label="Business - Year 2" value="business-year-2" />
            <Picker.Item label="Business - Year 3" value="business-year-3" />
            <Picker.Item label="Music Studies - Year 1" value="music-studies-year-1" />
            <Picker.Item label="Music Studies - Year 2" value="music-studies-year-2" />
            <Picker.Item label="Music Studies - Year 3" value="music-studies-year-3" />
            <Picker.Item label="None" value="none" />
          </Picker>
        </View>

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