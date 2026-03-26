import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SignInScreen } from "./src/screens/auth/SignInScreen";
import { ScanScreen } from "./src/screens/student/ScanScreen";
import { StudentDashboard } from "./src/screens/student/StudentDashboard";
import { TeacherDashboard } from "./src/screens/teacher/TeacherDashboard";
import { AdminDashboard } from "./src/screens/admin/AdminDashboard";
import { AdminUsersScreen } from "./src/screens/admin/AdminUsersScreen";
import { EditUserScreen } from "./src/screens/admin/EditUserScreen";
import { UserCalendarScreen } from "./src/screens/admin/UserCalendarScreen";
import { TeacherEventsScreen } from "./src/screens/teacher/TeacherEventsScreen";
import { CreateEventScreen } from "./src/screens/teacher/CreateEventScreen";
import { EditEventScreen } from "./src/screens/teacher/EditEventScreen";
import { TeacherCalendarScreen } from "./src/screens/teacher/TeacherCalendarScreen";
import { StudentCalendarScreen } from "./src/screens/student/StudentCalendarScreen";
import { AttendanceScreen } from "./src/screens/student/AttendanceScreen";

type UserRole = "student" | "teacher" | "admin";

type SignedInUser = {
  id: string;
  username: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  classGroup: string;
  attendance: string[];
  calendar: string[];
};

type RootStackParamList = {
  SignIn: undefined;
  StudentDashboard: undefined;
  TeacherDashboard: undefined;
  AdminDashboard: undefined;
  Scan: {
    studentEmail: string;
    eventId?: string;
  };
  TeacherEvents: undefined;
  CreateEvent: undefined;
  EditEvent: {
    event: {
      id: string;
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
      id: string;
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
      id: string;
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
  StudentCalendar: {
    classGroup : string;
    studentEmail: string;
  };
  Attendance: { 
    classGroup: string;
    studentEmail: string;
    studentName?: string;
    };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [signedInUser, setSignedInUser] = useState<SignedInUser | null>(null);

  function signOut() {
    setSignedInUser(null);
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!signedInUser ? (
          <Stack.Screen name="SignIn" options={{ headerShown: false }}>
            {() => <SignInScreen onSignedIn={setSignedInUser} />}
          </Stack.Screen>
        ) : signedInUser.role === "student" ? (
          <>
           <Stack.Screen name="StudentDashboard" options={{ title: "Student" }}>
              {({ navigation }) => (
                <StudentDashboard
                  onOpenCalendar={() =>
                   navigation.navigate("StudentCalendar", {
                      classGroup: signedInUser.classGroup,
                      studentEmail: signedInUser.email
                   })
                 }
                 onOpenAttendance={() =>
                   navigation.navigate("Attendance", {
                      classGroup: signedInUser.classGroup,
                      studentEmail: signedInUser.email
                    })
                 }
                 onSignOut={signOut}
                />
              )}
            </Stack.Screen>

           <Stack.Screen name="Scan" options={{ title: "Attendance Scanner" }}>
             {({ route, navigation }) => (
               <ScanScreen
                  onSignOut={signOut}
                 route={route as any}
                 navigation={navigation}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="StudentCalendar" options={{ title: "My Calendar" }}>
             {({ route, navigation }) => (
               <StudentCalendarScreen
                 route={route as any}
                 navigation={navigation}
               />
             )}
            </Stack.Screen>

            <Stack.Screen name="Attendance" options={{ title: "My Attendance" }}>
              {({ route }) => <AttendanceScreen route={route as any} />}
            </Stack.Screen>
          </>  
        ) : signedInUser.role === "teacher" ? (
          <>
            <Stack.Screen name="TeacherDashboard" options={{ title: "Teacher" }}>
              {({ navigation }) => (
                <TeacherDashboard
                  onSignOut={signOut}
                  onViewEvents={() => navigation.navigate("TeacherEvents")}
                  onCreateEvent={() => navigation.navigate("CreateEvent")}
                  onViewCalendar={() =>
                    navigation.navigate("TeacherCalendar", {
                      teacher: signedInUser.username
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

            <Stack.Screen name="EditEvent" options={{ title: "Edit Event" }}>
              {({ route, navigation }) => (
                <EditEventScreen route={route as any} navigation={navigation} />
              )}
            </Stack.Screen>

            <Stack.Screen name="TeacherCalendar" options={{ title: "My Calendar" }}>
              {({ route }) => <TeacherCalendarScreen route={route as any} />}
            </Stack.Screen>
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

         <Stack.Screen name="EditUser" options={{ title: "Edit User" }}>
           {({ route, navigation }) => (
              <EditUserScreen route={route as any} navigation={navigation} />
            )}
          </Stack.Screen>

         <Stack.Screen name="UserCalendar" options={{ title: "User Calendar" }}>
            {({ route, navigation }) => (
              <UserCalendarScreen route={route as any} navigation={navigation} />
            )}
          </Stack.Screen>

          <Stack.Screen name="Attendance" options={{ title: "Attendance" }}>
           {({ route }) => <AttendanceScreen route={route as any} />}
          </Stack.Screen>
        </>
      )}
      </Stack.Navigator>
   </NavigationContainer>
  );
}