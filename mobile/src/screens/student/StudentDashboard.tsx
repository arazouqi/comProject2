import React from "react";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  onOpenCalendar: () => void;
  onOpenAttendance: () => void;
  onSignOut: () => void;
};

export function StudentDashboard({
  onOpenCalendar,
  onOpenAttendance,
  onSignOut
}: Props) {
  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>
        Student Dashboard
      </Text>

      <View style={{ gap: 12 }}>
        <Button title="VIEW CALENDAR" onPress={onOpenCalendar} />
        <Button title="ATTENDANCE" onPress={onOpenAttendance} />
        <Button title="SIGN OUT" onPress={onSignOut} />
      </View>
    </SafeAreaView>
  );
}