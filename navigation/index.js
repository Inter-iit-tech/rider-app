import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "@rneui/base";

import {
  Login,
  Otp,
  MapTestScreen,
  MapSimulationTestScreen,
} from "./../screens";
import useAuthContext from "../hooks/useAuthContext";

export default function AppNavigator() {
  const { user } = useAuthContext();

  const AuthStack = createNativeStackNavigator();
  const AuthStackNavigator = () => {
    return (
      <AuthStack.Navigator>
        <AuthStack.Screen
          name="Home"
          component={Login}
          options={{ title: "Login", headerShown: false }}
        />
        <AuthStack.Screen
          name="otp"
          component={Otp}
          options={{
            title: "Verify OTP",
            headerShown: false,
          }}
        />
      </AuthStack.Navigator>
    );
  };

  const MainTabs = createBottomTabNavigator();
  const MainTabsNavigator = () => {
    return (
      <MainTabs.Navigator>
        {/* <MainTabs.Screen name="Tour" component={Tour} /> */}
        <MainTabs.Screen
          name="Map"
          component={MapTestScreen}
          options={{
            tabBarIcon: () => <Icon name="route" type="font-awesome-5" />,
          }}
        />
      </MainTabs.Navigator>
    );
  };

  let content = <AuthStackNavigator />;
  if (user) {
    content = <MainTabsNavigator />;
  }

  return <NavigationContainer>{content}</NavigationContainer>;
}
