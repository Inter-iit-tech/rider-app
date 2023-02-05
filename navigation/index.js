import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "@rneui/base";

import { Login, Otp, Tour, MapSimulation, Map } from "./../screens";
import useAuthContext from "../hooks/useAuthContext";
import Wrapper from "../utils/Wrapper";
import { TourContextProvider } from "../contexts/tourContext";

export default function AppNavigator() {
  const { user } = useAuthContext();

  const AuthStack = createNativeStackNavigator();
  const AuthStackNavigator = () => {
    return (
      <AuthStack.Navigator>
        <AuthStack.Screen
          name="Home"
          component={Login}
          options={{
            title: "Login",
            headerShown: false,
            animation: "none",
          }}
        />
        <AuthStack.Screen
          name="otp"
          component={Otp}
          options={{
            title: "Verify OTP",
            headerShown: false,
            animation: "none",
          }}
        />
      </AuthStack.Navigator>
    );
  };

  const MainTabs = createBottomTabNavigator();
  const MainTabsNavigator = () => {
    return (
      <MainTabs.Navigator>
        <MainTabs.Screen
          name="Orders"
          component={Tour}
          options={{
            tabBarIcon: () => <Icon name="list" type="font-awesome-5" />,
          }}
        />
        <MainTabs.Screen
          name="Map"
          component={Map}
          options={{
            tabBarIcon: () => <Icon name="map" type="font-awesome-5" />,
          }}
        />

        <MainTabs.Screen
          name="Tour Simulation"
          component={MapSimulation}
          options={{
            tabBarIcon: () => <Icon name="route" type="font-awesome-5" />,
          }}
        />
      </MainTabs.Navigator>
    );
  };

  let content = <AuthStackNavigator />;
  if (user) {
    content = (
      <TourContextProvider>
        <Wrapper>
          <MainTabsNavigator />
        </Wrapper>
      </TourContextProvider>
    );
  }

  return <NavigationContainer>{content}</NavigationContainer>;
}
