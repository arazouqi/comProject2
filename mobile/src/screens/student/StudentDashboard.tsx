import React from "react";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  onOpenScanner: () => void;
  onSignOut: () => void;
};

export function StudentDashboard({ onOpenScanner, onSignOut }: Props) {
  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>
        Student Dashboard
      </Text>

      <View style={{ gap: 12 }}>
        <Button title="View Calendar" onPress={() => {}} />
        <Button title="View Event" onPress={() => {}} />
        <Button title="Mark Attendance" onPress={onOpenScanner} />
        <Button title="Sign Out" onPress={onSignOut} />
      </View>
    </SafeAreaView>
  );
}