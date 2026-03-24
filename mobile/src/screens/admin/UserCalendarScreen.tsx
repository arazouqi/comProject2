import React, { useEffect, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../../services/api";

type UserRole = "student" | "teacher" | "admin";

type EventItem = {
  id: number;
  title: string;
  date: string;
  teacher: string;
};

type Props = {
  route: {
    params: {
      user: {
        id: number;
        username: string;
        role: UserRole;
      };
    };
  };
};

export function UserCalendarScreen({ route }: Props) {
  const { user } = route.params;

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchEvents() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events`);
      const data = await response.json();

      if (user.role === "teacher") {
        const filtered = data.filter(
          (event: EventItem) => event.teacher === user.username
        );
        setEvents(filtered);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
      Alert.alert("Error", "Failed to fetch events.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 8 }}>
        {user.username}'s Calendar
      </Text>

      <Text style={{ marginBottom: 16 }}>Role: {user.role}</Text>

      {loading ? (
        <Text>Loading calendar...</Text>
      ) : user.role !== "teacher" ? (
        <Text>
          Calendar view is currently only available for teacher accounts.
        </Text>
      ) : events.length === 0 ? (
        <Text>No events found for this user.</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 12,
                borderWidth: 1,
                borderRadius: 10,
                marginBottom: 12
              }}
            >
              <Text style={{ fontWeight: "700" }}>{item.title}</Text>
              <Text>Date: {item.date}</Text>
              <Text>Teacher: {item.teacher}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}