import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { API_BASE_URL } from "../../services/api";

export function CreateEventScreen() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [classGroup, setClassGroup] = useState("");
  const [teacher, setTeacher] = useState("teacher");

  async function handleCreateEvent() {
    if (!name.trim() || !location.trim() || !startTime.trim() || !endTime.trim() || !classGroup.trim() || !teacher.trim()) {
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
          name,
          location,
          startTime,
          endTime,
          classGroup,
          teacher
        })
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.error || "Failed to create event.");
        return;
      }

      Alert.alert("Success", `Event created: ${data.name}`);
      setName("");
      setLocation("");
      setStartTime("");
      setEndTime("");
      setClassGroup("");
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
          placeholder="Event name"
          value={name}
          onChangeText={setName}
          style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
        />

        <TextInput
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
          style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
        />

        <TextInput
          placeholder="Start time (e.g. 2026-03-30 10:00)"
          value={startTime}
          onChangeText={setStartTime}
          style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
        />

        <TextInput
          placeholder="End time (e.g. 2026-03-30 12:00)"
          value={endTime}
          onChangeText={setEndTime}
          style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
        />

        <View style={{ borderWidth: 1, borderRadius: 10 }}>
          <Picker
            selectedValue={classGroup}
            onValueChange={(itemValue) => setClassGroup(itemValue)}
          >
            <Picker.Item label="Select class group..." value="" />
            <Picker.Item label="Computer Science - Year 1" value="computer-science-year-1" />
            <Picker.Item label="Computer Science - Year 2" value="computer-science-year-2" />
            <Picker.Item label="Computer Science - Year 3" value="computer-science-year-3" />
            <Picker.Item label="Mathematics - Year 1" value="mathematics-year-1" />
            <Picker.Item label="Mathematics - Year 2" value="mathematics-year-2" />
            <Picker.Item label="Mathematics - Year 3" value="mathematics-year-3" />
            <Picker.Item label="Psychology - Year 1" value="psychology-year-1" />
            <Picker.Item label="Psychology - Year 2" value="psychology-year-2" />
            <Picker.Item label="Psychology - Year 3" value="psychology-year-3" />
            <Picker.Item label="Business - Year 1" value="business-year-1" />
            <Picker.Item label="Business - Year 2" value="business-year-2" />
            <Picker.Item label="Business - Year 3" value="business-year-3" />
            <Picker.Item label="Music Studies - Year 1" value="music-studies-year-1" />
            <Picker.Item label="Music Studies - Year 2" value="music-studies-year-2" />
            <Picker.Item label="Music Studies - Year 3" value="music-studies-year-3" />
          </Picker>
        </View>

        <TextInput
          placeholder="Teacher username"
          value={teacher}
          onChangeText={setTeacher}
          style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
        />

        <Button title="Create Event" onPress={handleCreateEvent} />
      </View>
    </SafeAreaView>
  );
}