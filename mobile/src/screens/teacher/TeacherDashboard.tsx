import React from "react";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  onSignOut: () => void;
  onViewEvents: () => void;
  onCreateEvent: () => void;
  onViewCalendar: () => void;
};

export function TeacherDashboard({
  onSignOut,
  onViewEvents,
  onCreateEvent,
  onViewCalendar
}: Props) {
  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>
        Teacher Dashboard
      </Text>

      <View style={{ gap: 12 }}>
        <Button title="View Calendar" onPress={onViewCalendar} />
        <Button title="Create Event" onPress={onCreateEvent} />
        <Button title="View Event" onPress={onViewEvents} />
        <Button title="Sign Out" onPress={onSignOut} />
      </View>
    </SafeAreaView>
  );
}