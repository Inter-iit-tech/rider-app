// import { StatusBar } from "expo-status-bar";
import { useState, useEffect, useRef } from "react";

import "react-native-gesture-handler";
import { StyleSheet, SafeAreaView, Platform, StatusBar } from "react-native";
import * as Notifications from "expo-notifications";
import AppNavigator from "./navigation";
import { AuthContextProvider } from "./contexts/authContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  return (
    <AuthContextProvider>
      <SafeAreaView style={styles.container}>
        <AppNavigator />
      </SafeAreaView>
    </AuthContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    fontFamily: "Roboto",
  },
});
