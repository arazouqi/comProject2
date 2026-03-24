import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../../services/api";

export function CreateEventScreen() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [teacher, setTeacher] = useState("teacher");

  async function handleCreateEvent() {
    if (!title.trim() || !date.trim() || !teacher.trim()) {
      Alert.alert("Missing info", "Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          date,
          teacher
        })
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", "Failed to create event.");
        return;
      }

      Alert.alert("Success", `Event created: ${data.title}`);
      setTitle("");
      setDate("");
    } catch (error) {
      console.error(error);
      Alert.alert("Network Error", "Could not connect to server.");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>
        Create Event
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

        <TextInput
          placeholder="Teacher"
          value={teacher}
          onChangeText={setTeacher}
          style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
        />

        <Button title="Create Event" onPress={handleCreateEvent} />
      </View>
    </SafeAreaView>
  );
}