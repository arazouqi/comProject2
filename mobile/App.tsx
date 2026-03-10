import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SignInScreen } from "./src/screens/auth/SignInScreen";
import { ScanScreen } from "./src/screens/student/ScanScreen";
import { StudentDashboard } from "./src/screens/student/StudentDashboard";
import { TeacherDashboard } from "./src/screens/teacher/TeacherDashboard";
import { AdminDashboard } from "./src/screens/admin/AdminDashboard";

type Role = "student" | "teacher" | "admin";

type RootStackParamList = {
  SignIn: undefined;
  StudentDashboard: undefined;
  TeacherDashboard: undefined;
  AdminDashboard: undefined;
  Scan: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);

  function signOut() {
    setSignedInEmail(null);
    setRole(null);
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!signedInEmail || !role ? (
          <Stack.Screen name="SignIn" options={{ headerShown: false }}>
            {() => (
              <SignInScreen
                onSignedIn={(email, selectedRole) => {
                  setSignedInEmail(email);
                  setRole(selectedRole);
                }}
              />
            )}
          </Stack.Screen>
        ) : role === "student" ? (
          <>
            <Stack.Screen name="StudentDashboard" options={{ title: "Student" }}>
              {({ navigation }) => (
                <StudentDashboard
                  onOpenScanner={() => navigation.navigate("Scan")}
                  onSignOut={signOut}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Scan" options={{ title: "Attendance Scanner" }}>
              {() => <ScanScreen onSignOut={signOut} />}
            </Stack.Screen>
          </>
        ) : role === "teacher" ? (
          <Stack.Screen name="TeacherDashboard" options={{ title: "Teacher" }}>
            {() => <TeacherDashboard onSignOut={signOut} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="AdminDashboard" options={{ title: "Admin" }}>
            {() => <AdminDashboard onSignOut={signOut} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}