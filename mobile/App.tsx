import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SignInScreen } from "./src/screens/SignInScreen";
import { ScanScreen } from "./src/screens/ScanScreen";

type RootStackParamList = {
  SignIn: undefined;
  Scan: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {signedInEmail ? (
          <Stack.Screen name="Scan" options={{ title: "Attendance Scanner" }}>
            {() => <ScanScreen onSignOut={() => setSignedInEmail(null)} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="SignIn" options={{ headerShown: false }}>
            {() => <SignInScreen onSignedIn={(email) => setSignedInEmail(email)} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}