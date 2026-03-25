import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../../services/api";

type UserRole = "student" | "teacher" | "admin";

type SignedInUser = {
  id: string;
  username: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  classGroup: string;
  attendance: string[];
  calendar: string[];
};

type Props = {
  onSignedIn: (user: SignedInUser) => void;
};

export function SignInScreen({ onSignedIn }: Props) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignIn() {
    if (!login.trim() || !password.trim()) {
      Alert.alert("Missing info", "Please enter your email/username and password.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          login,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Login Failed", data.error || "Invalid login details.");
        return;
      }

      onSignedIn(data.user);
    } catch (error) {
      console.error("Login failed:", error);
      Alert.alert("Network Error", "Could not connect to server.");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <Text style={{ fontSize: 26, fontWeight: "700", marginBottom: 8 }}>
        Attendance
      </Text>
      <Text style={{ opacity: 0.7, marginBottom: 16 }}>
        Sign in to continue
      </Text>

      <View style={{ gap: 12 }}>
        <TextInput
          value={login}
          onChangeText={setLogin}
          placeholder="Email or username"
          autoCapitalize="none"
          style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
        />

        <Button title="Sign in" onPress={handleSignIn} />
      </View>
    </SafeAreaView>
  );
}