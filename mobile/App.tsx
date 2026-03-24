import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SignInScreen } from "./src/screens/auth/SignInScreen";
import { ScanScreen } from "./src/screens/student/ScanScreen";
import { StudentDashboard } from "./src/screens/student/StudentDashboard";
import { TeacherDashboard } from "./src/screens/teacher/TeacherDashboard";
import { AdminDashboard } from "./src/screens/admin/AdminDashboard";
import { AdminUsersScreen } from "./src/screens/admin/AdminUsersScreen";
import { TeacherEventsScreen } from "./src/screens/teacher/TeacherEventsScreen";
import { CreateEventScreen } from "./src/screens/teacher/CreateEventScreen";
import { EditEventScreen } from "./src/screens/teacher/EditEventScreen";
import { TeacherCalendarScreen } from "./src/screens/teacher/TeacherCalendarScreen";
import { EditUserScreen } from "./src/screens/admin/EditUserScreen";
import { UserCalendarScreen } from "./src/screens/admin/UserCalendarScreen";

type Role = "student" | "teacher" | "admin";

type RootStackParamList = {
  SignIn: undefined;
  StudentDashboard: undefined;
  TeacherDashboard: undefined;
  AdminDashboard: undefined;
  Scan: undefined;
  TeacherEvents: undefined;
  CreateEvent: undefined;
  EditEvent: {
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
  TeacherCalendar: {
    teacher: string;
  };
  AdminUsers: undefined;

  EditUser: {
   user: {
      id: number;
     username: string;
     name: string;
      email: string;
      password: string;
      role: "student" | "teacher" | "admin";
     classGroup: string;
     attendance: string[];
     calendar: string[];
   };
  };

  UserCalendar: {
    user: {
      id: number;
      username: string;
      name: string;
      email: string;
      password: string;
      role: "student" | "teacher" | "admin";
      classGroup: string;
      attendance: string[];
      alendar: string[];
    };
  };
}
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
          <>
            <Stack.Screen name="TeacherDashboard" options={{ title: "Teacher" }}>
              {({ navigation }) => (
                <TeacherDashboard
                  onSignOut={signOut}
                  onViewEvents={() => navigation.navigate("TeacherEvents")}
                  onCreateEvent={() => navigation.navigate("CreateEvent")}
                  onViewCalendar={() =>
                    navigation.navigate("TeacherCalendar", {
                      teacher: signedInEmail || "teacher"
                    })
                  }
                />
              )}
            </Stack.Screen>

            <Stack.Screen
              name="TeacherEvents"
              options={{ title: "Teacher Events" }}
              component={TeacherEventsScreen}
            />

            <Stack.Screen
              name="CreateEvent"
              options={{ title: "Create Event" }}
              component={CreateEventScreen}
            />

            <Stack.Screen
              name="EditEvent"
              options={{ title: "Edit Event" }}
              component={EditEventScreen}
            />

            <Stack.Screen
              name="TeacherCalendar"
              options={{ title: "My Calendar" }}
              component={TeacherCalendarScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="AdminDashboard" options={{ title: "Admin" }}>
              {({ navigation }) => (
                <AdminDashboard
                  onSignOut={signOut}
                  onManageUsers={() => navigation.navigate("AdminUsers")}
                />
              )}
            </Stack.Screen>

            <Stack.Screen
              name="AdminUsers"
              options={{ title: "Manage Users" }}
              component={AdminUsersScreen}
            />

            <Stack.Screen
             name="EditUser"
             options={{ title: "Edit User" }}
             component={EditUserScreen}
            />
            <Stack.Screen
              name="UserCalendar"
              options={{ title: "User Calendar" }}
              component={UserCalendarScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}