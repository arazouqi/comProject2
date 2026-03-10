import React from "react";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  onSignOut: () => void;
};

export function AdminDashboard({ onSignOut }: Props) {
  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>
        Admin Dashboard
      </Text>

      <View style={{ gap: 12 }}>
        <Button title="Create User" onPress={() => {}} />
        <Button title="Delete User" onPress={() => {}} />
        <Button title="Modify User" onPress={() => {}} />
        <Button title="View Users" onPress={() => {}} />
        <Button title="View User Calendar" onPress={() => {}} />
        <Button title="Sign Out" onPress={onSignOut} />
      </View>
    </SafeAreaView>
  );
}