import React, { useEffect, useState } from "react";
import { Alert, Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";

type Props = { onSignOut: () => void };

function parseQr(data: string): { sessionId: string } | null {
  const raw = (data ?? "").trim();
  if (!raw.startsWith("session:")) return null;
  const sessionId = raw.slice("session:".length).trim();
  return sessionId ? { sessionId } : null;
}

export function ScanScreen({ onSignOut }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission, requestPermission]);

  async function handleScan(data: string) {
    if (scanned) return;
    setScanned(true);

    const parsed = parseQr(data);
    if (!parsed) {
      Alert.alert("Invalid QR", "Expected a QR like: session:<id>");
      return;
    }

    Alert.alert("Scanned!", `Session ID: ${parsed.sessionId}`);
  }

  if (!permission) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Requesting camera permission…</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={{ flex: 1, padding: 16, justifyContent: "center", gap: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>Camera permission needed</Text>
        <Button title="Grant permission" onPress={requestPermission} />
        <Button title="Sign out" onPress={onSignOut} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 16, gap: 8 }}>
        <Text style={{ fontSize: 20, fontWeight: "700" }}>Scan QR</Text>
        <Text style={{ opacity: 0.7 }}>Point your camera at the lecturer’s QR.</Text>
      </View>

      <View style={{ flex: 1 }}>
        <CameraView
          style={{ flex: 1 }}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={(result) => handleScan(result.data)}
        />
      </View>

      <View style={{ padding: 16, gap: 10 }}>
        <Button title={scanned ? "Scan again" : "Scanning…"} onPress={() => setScanned(false)} />
        <Button title="Sign out" onPress={onSignOut} />
      </View>
    </SafeAreaView>
  );
}