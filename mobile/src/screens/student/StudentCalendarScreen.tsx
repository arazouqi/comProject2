import React, { useEffect, useState } from "react";
import { Alert, Button, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../../services/api";

type EventItem = {
  id: string;
  name: string;
  location: string;
  startTime: string;
  endTime: string;
  classGroup: string;
  teacher: string;
};

type Props = {
  route: {
    params: {
      classGroup: string;
    };
  };
  navigation: any;
};

export function StudentCalendarScreen({ route, navigation }: Props) {
  const { classGroup } = route.params;

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchEvents() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events`);
      const data = await response.json();

      const filtered = data.filter(
        (event: EventItem) => event.classGroup === classGroup
      );

      setEvents(filtered);
    } catch (error) {
      console.error("Failed to fetch student events:", error);
      Alert.alert("Error", "Failed to fetch events.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  function getAttendanceStatus(event: EventItem) {
    const now = new Date();
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);

    if (now < start) return "not-open";
    if (now > end) return "closed";
    return "open";
  }

  function getStatusText(status: string) {
    if (status === "not-open") return "Attendance not open yet";
    if (status === "closed") return "Attendance closed";
    return "Attendance open";
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>
        My Calendar
      </Text>

      {loading ? (
        <Text>Loading events...</Text>
      ) : events.length === 0 ? (
        <Text>No events found for your class group.</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const status = getAttendanceStatus(item);

            return (
              <View
                style={{
                  padding: 12,
                  borderWidth: 1,
                  borderRadius: 10,
                  marginBottom: 12,
                  gap: 8
                }}
              >
                <Text style={{ fontWeight: "700" }}>{item.name}</Text>
                <Text>Location: {item.location}</Text>
                <Text>Start: {item.startTime}</Text>
                <Text>End: {item.endTime}</Text>
                <Text>Teacher: {item.teacher}</Text>
                <Text>Class Group: {item.classGroup}</Text>
                <Text>{getStatusText(status)}</Text>

                {status === "open" ? (
                  <Button
                    title="SCAN ATTENDANCE"
                    onPress={() => navigation.navigate("Scan")}
                  />
                ) : (
                  <Button
                    title={status === "not-open" ? "NOT OPEN YET" : "ATTENDANCE CLOSED"}
                    onPress={() => {}}
                    disabled
                  />
                )}
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}