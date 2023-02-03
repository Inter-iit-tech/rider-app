import { useState, useEffect, useRef } from "react";
import { SafeAreaView, StyleSheet, StatusBar } from "react-native";
import * as Notifications from "expo-notifications";
import AppNavigator from "../navigation";
import useTourContext from "../hooks/useTourContext";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Wrapper({ children }) {
  const notificationListener = useRef();
  const responseListener = useRef();
  const { synchroniseTourData } = useTourContext();

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // Should fetch tours from db
        synchroniseTourData();
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // Should fetch tours from db
        synchroniseTourData();
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return <AppNavigator />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    fontFamily: "Roboto",
  },
});
