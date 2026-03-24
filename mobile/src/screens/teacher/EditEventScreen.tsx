import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { API_BASE_URL } from "../../services/api";

type Props = {
  route: {
    params: {
      event: {
        id: number;
        name: string;
        location: string;
        startTime: string;
        endTime: string;
        classGroup: string;
        teacher: string;
      };
    };
  };
  navigation: any;
};

export function EditEventScreen({ route, navigation }: Props) {
  const { event } = route.params;

  const [name, setName] = useState(event.name);
  const [location, setLocation] = useState(event.location);
  const [startTime, setStartTime] = useState(event.startTime);
  const [endTime, setEndTime] = useState(event.endTime);
  const [classGroup, setClassGroup] = useState(event.classGroup);

  async function handleUpdateEvent() {
    if (!name.trim() || !location.trim() || !startTime.trim() || !endTime.trim() || !classGroup.trim()) {
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
          name,
          location,
          startTime,
          endTime,
          classGroup
        })
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.error || "Failed to update event.");
        return;
      }

      Alert.alert("Success", `Event updated: ${data.name}`);
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
          placeholder="Start time"
          value={startTime}
          onChangeText={setStartTime}
          style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
        />

        <TextInput
          placeholder="End time"
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

        <Button title="Save Changes" onPress={handleUpdateEvent} />
      </View>
    </SafeAreaView>
  );
}