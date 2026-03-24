import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Role = "student" | "teacher" | "admin";

type Props = {
  onSignedIn: (email: string, role: Role) => void;
};

export function SignInScreen({ onSignedIn }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("student");

  function signIn() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing info", "Please enter email and password.");
      return;
    }

    onSignedIn(email.trim().toLowerCase(), role);
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <Text style={{ fontSize: 26, fontWeight: "700", marginBottom: 8 }}>
        Attendance
      </Text>
      <Text style={{ opacity: 0.7, marginBottom: 16 }}>
        Sign in to continue
      </Text>

      <View style={{ gap: 8, marginBottom: 16 }}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
        />
      </View>

      <Text style={{ marginBottom: 8, fontWeight: "600" }}>Select role</Text>

      <View style={{ gap: 8, marginBottom: 16 }}>
        <Button title="Student" onPress={() => setRole("student")} />
        <Button title="Teacher" onPress={() => setRole("teacher")} />
        <Button title="Admin" onPress={() => setRole("admin")} />
      </View>

      <Text style={{ marginBottom: 16 }}>Current role: {role}</Text>

      <Button title="Sign in" onPress={signIn} />
    </SafeAreaView>
  );
}