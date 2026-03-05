import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = { onSignedIn: (email: string) => void };

export function SignInScreen({ onSignedIn }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function signIn() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing info", "Please enter email and password.");
      return;
    }
    onSignedIn(email.trim().toLowerCase());
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, justifyContent: "center", gap: 12 }}>
      <Text style={{ fontSize: 26, fontWeight: "700" }}>Attendance</Text>
      <Text style={{ opacity: 0.7 }}>Sign in to continue</Text>

      <View style={{ gap: 8 }}>
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

      <Button title="Sign in" onPress={signIn} />
    </SafeAreaView>
  );
}