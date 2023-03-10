import React, { useState } from "react";
import { StyleSheet, Text, View, Image, Alert } from "react-native";
import { Button } from "@rneui/themed";
import { CommonActions, useNavigation } from "@react-navigation/native";
import firebase from "firebase/compat";
import axios from "./../utils/axios/request";
import MobileLogo from "./../assets/mobile.png";
import Input from "../components/Input";
import useAuthContext from "../hooks/useAuthContext";
import registerForPushNotificationsAsync from "./../utils/pushToken";

export default function OTP({ route }) {
  const [otp, setOTP] = useState("");
  const navigation = useNavigation();
  const authContext = useAuthContext();

  // programmatically navigating to the maps page is no longer necessary
  // and the resetNavigation function can be omitted
  const resetNavigation = () => {
    navigation.dispatch((state) => {
      return CommonActions.reset({
        index: 0,
        routes: [{ name: "Maps" }],
      });
    });
  };
  const updateLoggedUser = async (userCredential) => {
    // const token = await registerForPushNotificationsAsync();
    const url = `/api/v1/rider/login/+91${otp}`;
    // if (userCredential.additionalUserInfo.isNewUser) {
    axios
      .post(url)
      .then((res) => {
        const rider = res.data.rider;
        console.log({ rider });
        // TODO: set user from db given from res instead of firebase
        authContext.login(rider);
      })
      .catch((err) => {
        console.log(err);
      });
    // } else {
    //   // TODO: set user from db given from res instead of firebase
    //   authContext.login(userCredential.user);
    // }
  };

  const handleTextChange = (text) => {
    setOTP(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={MobileLogo}
          resizeMode={"contain"}
          style={styles.image}
        />
      </View>
      <View>
        <View style={styles.content}>
          <Text style={styles.heading}>OTP Confirmation '</Text>
          <Text style={styles.subtext}>Please enter the one time password</Text>
          <View style={{ width: "100%", marginTop: 40 }}>
            <Input
              label="Enter otp"
              onChangeText={handleTextChange}
              value={otp}
              type="number"
            />
            <Button
              buttonStyle={{ padding: 10 }}
              radius={20}
              containerStyle={{ marginTop: 20 }}
              onPress={updateLoggedUser}
            >
              Submit
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: 20,
    width: "100%",
  },
  imageContainer: {
    height: 200,
  },
  image: {
    resizeMode: "cover",
    flex: 1,
    width: "100%",
  },
  content: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginVertical: 30,
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 15,
  },
  subtext: {
    color: "#b8b6b6",
    fontSize: 16,
  },
});
