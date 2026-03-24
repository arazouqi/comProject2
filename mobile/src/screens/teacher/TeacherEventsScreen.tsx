import React, { useEffect, useState } from "react";
import { Alert, Button, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../../services/api";

type EventItem = {
  id: number;
  title: string;
  date: string;
  teacher: string;
};

type Props = {
  navigation: any;
};

export function TeacherEventsScreen({ navigation }: Props) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchEvents() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events`);
      const data = await response.json();
      setEvents(data);
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

  async function handleDeleteEvent(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        Alert.alert("Error", "Failed to delete event.");
        return;
      }

      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
      Alert.alert("Success", "Event deleted.");
    } catch (error) {
      console.error("Delete failed:", error);
      Alert.alert("Network Error", "Could not connect to server.");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>
        Teacher Events
      </Text>

      {loading ? (
        <Text>Loading events...</Text>
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
                marginBottom: 12,
                gap: 8
              }}
            >
              <Text style={{ fontWeight: "700" }}>{item.title}</Text>
              <Text>Date: {item.date}</Text>
              <Text>Teacher: {item.teacher}</Text>

              <Button
                title="Edit Event"
                onPress={() => navigation.navigate("EditEvent", { event: item })}
              />

              <Button
                title="Delete Event"
                onPress={() => handleDeleteEvent(item.id)}
              />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}