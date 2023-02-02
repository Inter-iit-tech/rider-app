// import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import { StyleSheet, SafeAreaView, Platform, StatusBar } from "react-native";

import { AuthContextProvider } from "./contexts/authContext";
import AppNavigator from "./navigation";

export default function App() {
  console.log(StatusBar.currentHeight);
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
