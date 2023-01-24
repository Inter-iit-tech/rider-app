// import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import MapTestScreen from "./screens/MapTest";
import Login from "./screens/Login";
import Otp from "./screens/OTP";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import "react-native-gesture-handler";
const Stack = createNativeStackNavigator();

export default function App() {
  console.log(StatusBar.currentHeight);
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="otp"
            component={Otp}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Maps" component={MapTestScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
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
