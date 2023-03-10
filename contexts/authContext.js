import { createContext, useEffect, useState } from "react";
import { View, Image, StyleSheet, Alert } from "react-native";
import {
  getItemAsync,
  setItemAsync,
  isAvailableAsync,
  deleteItemAsync,
} from "expo-secure-store";
import sleep from "../utils/sleep";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const login = async (newUser) => {
    try {
      setItemAsync("user", JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      Alert.alert("Error", "Failed to store rider credentials on your device");
      setUser(null);
      throw new Error(error);
    }
  };

  const logout = async () => {
    try {
      await deleteItemAsync("user");
      setUser(null);
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to remove rider credentials from your device"
      );
      console.log(error);
    }
  };

  useEffect(() => {
    const getUserFromStorage = async () => {
      await sleep(2000);
      try {
        const isSecureStoreAvailable = await isAvailableAsync();
        if (isSecureStoreAvailable) {
          const storedUser = await getItemAsync("user");
          if (storedUser !== null) {
            setUser(JSON.parse(storedUser));
          }
        }
        setLoading(false);
      } catch (error) {
        Alert.alert(
          "Login Required",
          "Existing credentials could not be loaded, please login again"
        );
        console.log(error);
      }
    };

    getUserFromStorage();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {loading && (
        <View style={styles.container}>
          <Image
            source={require("./../assets/appLogo.gif")}
            style={styles.logo}
          />
        </View>
      )}
      {!loading && children}
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  logo: {
    height: 300,
    aspectRatio: 1,
  },
});
