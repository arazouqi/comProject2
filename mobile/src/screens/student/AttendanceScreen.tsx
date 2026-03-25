import React, { useEffect, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
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
  attendees?: string[];
};

type Props = {
  route: {
    params: {
      classGroup: string;
      studentEmail: string;
    };
  };
};

export function AttendanceScreen({ route }: Props) {
  const { classGroup, studentEmail } = route.params;

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
      console.error("Failed to fetch attendance data:", error);
      Alert.alert("Error", "Failed to fetch attendance data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  const now = new Date();

  const relevantEvents = events.filter((event) => {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);

    const isPast = end < now;
    const isOngoing = start <= now && end >= now;
    const hasAttended =
      Array.isArray(event.attendees) &&
      event.attendees.includes(studentEmail);

    return isPast || (isOngoing && hasAttended);
  });

  const totalEvents = relevantEvents.length;

  const attendedEvents = relevantEvents.filter(
    (event) =>
      Array.isArray(event.attendees) &&
      event.attendees.includes(studentEmail)
  ).length;

  const missedEvents = totalEvents - attendedEvents;

  const attendancePercentage =
    totalEvents === 0 ? 0 : Math.round((attendedEvents / totalEvents) * 100);

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>
        My Attendance
      </Text>

      {loading ? (
        <Text>Loading attendance...</Text>
      ) : (
        <>
          <View
            style={{
              padding: 16,
              borderWidth: 1,
              borderRadius: 12,
              marginBottom: 20,
              gap: 8
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700" }}>
              Attendance Percentage: {attendancePercentage}%
            </Text>
            <Text>Counted Events: {totalEvents}</Text>
            <Text>Attended: {attendedEvents}</Text>
            <Text>Missed: {missedEvents}</Text>
          </View>

          <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
            Attendance Breakdown
          </Text>

          {relevantEvents.length === 0 ? (
            <Text>No counted events yet.</Text>
          ) : (
            <FlatList
              data={relevantEvents}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const attended =
                  Array.isArray(item.attendees) &&
                  item.attendees.includes(studentEmail);

                return (
                  <View
                    style={{
                      padding: 12,
                      borderWidth: 1,
                      borderRadius: 10,
                      marginBottom: 12,
                      gap: 6
                    }}
                  >
                    <Text style={{ fontWeight: "700" }}>{item.name}</Text>
                    <Text>Location: {item.location}</Text>
                    <Text>Start: {item.startTime}</Text>
                    <Text>End: {item.endTime}</Text>
                    <Text>Status: {attended ? "Attended" : "Missed"}</Text>
                  </View>
                );
              }}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
}