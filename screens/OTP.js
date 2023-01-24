import React, { useState, useRef } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import MobileLogo from "./../assets/mobile.png";
import Input from "../components/Input";
import { Button } from "@rneui/themed";
import { firebaseConfig } from "../utils/firebaseConfig";
import firebase from "firebase/compat";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { Alert } from "react-native";

export default function OTP({ route }) {
  const [otp, setOTP] = useState("");
  console.log(route.params.verificationId);
  //   const [verificationId, setVerificationId] = useState(
  //     route.params.verificationId
  //   );
  const confirmCode = () => {
    console.log(otp);
    const verificationId = route.params.verificationId;
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      otp
    );
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(() => {
        setOTP("");
        Alert.alert("OTP Successful. Welcome to Dashboard.");
      })
      .catch((error) => {
        // show an alert in case of error
        console.log(error);

        Alert.alert("Invalid otp or otp expired");
      });
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
