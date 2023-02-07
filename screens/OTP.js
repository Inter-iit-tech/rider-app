import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { Button } from "@rneui/themed";
import firebase from "firebase/compat";
import axios from "./../utils/axios/request";
import MobileLogo from "./../assets/mobile.png";
import Input from "../components/Input";
import useAuthContext from "../hooks/useAuthContext";
import registerForPushNotificationsAsync from "./../utils/pushToken";
import useLoadingIndicator from "../hooks/useLoadingIndicator";

export default function OTP({ route }) {
  const [otp, setOTP] = useState("");
  const authContext = useAuthContext();
  const [loading, showLoading, hideLoading] = useLoadingIndicator();

  const updateLoggedUser = async (userCredential) => {
    const token = await registerForPushNotificationsAsync();
    const url = `/api/v1/rider/update/${userCredential.user.phoneNumber}`;
    const data = {
      token: token,
    };
    // if (userCredential.additionalUserInfo.isNewUser) {
    axios
      .post(url, data)
      .then((res) => {
        console.log(res.data.rider);
        // TODO: set user from db given from res instead of firebase
        authContext.login(res.data.rider);
        Alert.alert("OTP Successful. Welcome to Dashboard.");
      })
      .catch((err) => {
        console.log(err);
      });
    // } else {
    //   // TODO: set user from db given from res instead of firebase
    //   authContext.login(userCredential.user);
    // }
  };

  const confirmCode = async () => {
    showLoading();
    const verificationId = route.params.verificationId;
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      otp
    );
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(async (userCredential) => {
        setOTP("");
        console.log("Getting token");
        updateLoggedUser(userCredential);
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Invalid otp or otp expired");
      });
    hideLoading();
  };

  const handleTextChange = (text) => {
    setOTP(text);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.imageContainer}>
        <Image
          source={MobileLogo}
          resizeMode={"contain"}
          style={styles.image}
        />
      </View>
      <View>
        <View style={styles.content}>
          <Text style={styles.heading}>OTP Confirmation</Text>
          <Text style={styles.subtext}>Please enter the one time password</Text>
          <View style={{ width: "100%", marginTop: 40 }}>
            <Input
              label="Enter otp"
              onChangeText={handleTextChange}
              value={otp}
            />
            <Button
              buttonStyle={{ padding: 10 }}
              radius={20}
              containerStyle={{ marginTop: 20 }}
              onPress={confirmCode}
            >
              Submit
            </Button>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    justifyContent: "center",
    alignItems: "center",
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
