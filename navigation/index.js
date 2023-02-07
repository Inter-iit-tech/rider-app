import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "@rneui/base";

import { Login, Otp, Tour, MapSimulation, Map } from "./../screens";
import useAuthContext from "../hooks/useAuthContext";
import Wrapper from "../utils/Wrapper";
import { TourContextProvider } from "../contexts/tourContext";
import COLORS from "../assets/colors/colors";
import LogoutButton from "../components/LogoutButton";

export default function AppNavigator() {
  const { user } = useAuthContext();

  const AuthStack = createNativeStackNavigator();
  const AuthStackNavigator = () => {
    return (
      <AuthStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "none",
          contentStyle: {
            backgroundColor: "white",
          },
        }}
      >
        <AuthStack.Screen
          name="Home"
          component={Login}
          options={{
            title: "Login",
          }}
        />
        <AuthStack.Screen
          name="otp"
          component={Otp}
          options={{
            title: "Verify OTP",
          }}
        />
      </AuthStack.Navigator>
    );
  };

  const MainTabs = createBottomTabNavigator();
  const MainTabsNavigator = () => {
    return (
      <MainTabs.Navigator
        sceneContainerStyle={{ backgroundColor: "white" }}
        screenOptions={{
          tabBarActiveTintColor: COLORS.blue,
          headerRight: LogoutButton,
        }}
      >
        <MainTabs.Screen
          name="Orders"
          component={Tour}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon
                name="list"
                type="font-awesome-5"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <MainTabs.Screen
          name="Map"
          component={Map}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon
                name="map"
                type="font-awesome-5"
                color={color}
                size={size}
              />
            ),
          }}
        />

        <MainTabs.Screen
          name="Tour Simulation"
          component={MapSimulation}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon
                name="route"
                type="font-awesome-5"
                color={color}
                size={size}
              />
            ),
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
