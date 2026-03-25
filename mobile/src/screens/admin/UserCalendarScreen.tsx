import React, { useEffect, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../../services/api";

type UserRole = "student" | "teacher" | "admin";

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
      user: {
        id: string;
        username: string;
        role: UserRole;
        classGroup: string;
      };
    };
  };
  navigation: any;
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
      } else if (user.role === "student") {
        const filtered = data.filter(
          (event: EventItem) => event.classGroup === user.classGroup
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
      ) : user.role === "admin" ? (
        <Text>Calendar view is not used for admin accounts.</Text>
      ) : events.length === 0 ? (
        <Text>No events found for this user.</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 12,
                borderWidth: 1,
                borderRadius: 10,
                marginBottom: 12
              }}
            >
              <Text style={{ fontWeight: "700" }}>{item.name}</Text>
              <Text>Location: {item.location}</Text>
              <Text>Start: {item.startTime}</Text>
              <Text>End: {item.endTime}</Text>
              <Text>Class Group: {item.classGroup}</Text>
              <Text>Teacher: {item.teacher}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}