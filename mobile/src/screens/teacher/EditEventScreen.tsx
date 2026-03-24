import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../../services/api";

type Props = {
  route: {
    params: {
      event: {
        id: number;
        title: string;
        date: string;
        teacher: string;
      };
    };
  };
  navigation: any;
};

export function EditEventScreen({ route, navigation }: Props) {
  const { event } = route.params;

  const [title, setTitle] = useState(event.title);
  const [date, setDate] = useState(event.date);

  async function handleUpdateEvent() {
    if (!title.trim() || !date.trim()) {
      Alert.alert("Missing info", "Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          date
        })
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", "Failed to update event.");
        return;
      }

      Alert.alert("Success", `Event updated: ${data.title}`);
      navigation.goBack();
    } catch (error) {
      console.error("Update failed:", error);
      Alert.alert("Network Error", "Could not connect to server.");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>
        Edit Event
      </Text>

      <View style={{ gap: 12 }}>
        <TextInput
          placeholder="Event title"
          value={title}
          onChangeText={setTitle}
          style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
        />

        <TextInput
          placeholder="Date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
          style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
        />

        <Button title="Save Changes" onPress={handleUpdateEvent} />
      </View>
    </SafeAreaView>
  );
}