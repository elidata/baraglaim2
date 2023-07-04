import React from "react";
import {
  SafeAreaView,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import HomeScreen from "./components/HomeScreen";
import HeaderIcons from "./components/HeaderIcons";
import AddChild from "./components/AddChild";
import WatchMyChilds from "./components/WatchMyChilds";
import MyCommunity from "./components/MyCommunity";
import WalkingGroups from "./components/WalkingGroups";
import JoinWalkingGroup from "./components/JoinWalkingGroup";
import MyWalkingGroup from "./components/MyWalkingGroup";
import GroupProfile from "./components/GroupProfile";
import WelcomePage from "./components/WelcomePage";
import CreateWalkingGroup from "./components/CreateWalkingGroup";
import JoinCertainGroup from "./components/JoinCertainGroup";
import SchoolProfile from "./components/SchoolProfile";
import CreateCommunity from "./components/CreateCommunity";
import UserProfile from "./components/UserProfile";
// import AlmogItayMap from "./DataBase/Dar";

const Stack = createStackNavigator();

function AppStack() {
  return (
    <Stack.Navigator
      initialRouteName="LoginPage"
      screenOptions={{
        headerShown: false, // Hide the header for all screens
      }}
    >
      <Stack.Screen
        name="LoginPage"
        options={{ title: "התחברות" }}
        component={LoginPage}
      />

      <Stack.Screen
        name="RegisterPage"
        options={{ title: "הרשמה" }}
        component={RegisterPage}
      />
      <Stack.Screen
        name="CreateWalkingGroup"
        options={{ title: "יצירת קובצת הליכה" }}
        component={CreateWalkingGroup}
      />
      <Stack.Screen
        name="WelcomePage"
        options={{ title: "ברוך הבא" }}
        component={WelcomePage}
      />
      <Stack.Screen
        name="HomeScreen"
        options={{ title: "בית" }}
        component={HomeScreen}
      />
      <Stack.Screen
        name="HeaderIcons"
        options={{ title: "Header" }}
        component={HeaderIcons}
      />
      <Stack.Screen
        name="MyCommunity"
        options={{ title: "MyCommunity" }}
        component={MyCommunity}
      />
      <Stack.Screen
        name="WalkingGroups"
        options={{ title: "קבוצות הליכה" }}
        component={WalkingGroups}
      />
      <Stack.Screen
        name="WatchMyChilds"
        options={{ title: "הילדים שלי" }}
        component={WatchMyChilds}
      />
      <Stack.Screen
        name="AddChild"
        options={{ title: "הוספת ילד/ה" }}
        component={AddChild}
      />
      <Stack.Screen
        name="MyWalkingGroup"
        options={{ title: "קבוצות ההליכה שלי" }}
        component={MyWalkingGroup}
      />
      <Stack.Screen
        name="JoinWalkingGroup"
        options={{ title: "הרשמה לקבוצת הליכה" }}
        component={JoinWalkingGroup}
      />
      <Stack.Screen
        name="GroupProfile"
        options={{ title: "פרופיל קבוצה" }}
        component={GroupProfile}
      />
      <Stack.Screen
        name="JoinCertainGroup"
        options={{ title: "הרשמה לקבוצה" }}
        component={JoinCertainGroup}
      />
      <Stack.Screen
        name="CreateCommunity"
        options={{ title: "יצירת קהילה" }}
        component={CreateCommunity}
      />
      <Stack.Screen
        name="SchoolProfile"
        options={{ title: "פרופיל בית ספר" }}
        component={SchoolProfile}
      />
      <Stack.Screen
        name="UserProfile"
        options={{ title: "פרופיל משתמש" }}
        component={UserProfile}
      />
    </Stack.Navigator>
  );
}
export default function App() {
  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

