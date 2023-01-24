import React, { useState, useRef } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import MobileLogo from "./../assets/mobile.png";
import Input from "../components/Input";
import { Button } from "@rneui/themed";
import { firebaseConfig } from "../utils/firebaseConfig";
import firebase from "firebase/compat";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Login({}) {
  const [mobile, setMobile] = useState("+91");
  const [verificationId, setVerificationId] = useState(null);
  const recaptchaVerifier = useRef(null);
  const navigation = useNavigation();

  const sendVerification = () => {
    // navigation.navigate("otp");
    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    phoneProvider
      .verifyPhoneNumber(mobile, recaptchaVerifier.current)
      .then((verificationId) => {
        navigation.navigate("otp", {
          verificationId: verificationId,
        });
      })
      .catch((err) => {
        Alert.alert("Invalid mobile number or internal server error");
      });
  };

  const confirmCode = () => {
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      code
    );
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(() => {
        setCode("");
      })
      .catch((error) => {
        // show an alert in case of error
        Alert.alert("Invalid mobile number");
      });
    Alert.alert("Login Successful. Welcome to Dashboard.");
  };
  const handleTextChange = (text) => {
    setMobile(text);
  };
  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={true}
      />
      <View style={styles.imageContainer}>
        <Image
          source={MobileLogo}
          resizeMode={"contain"}
          style={styles.image}
        />
      </View>
      <View>
        <View style={styles.content}>
          <Text style={styles.heading}>OTP Verification </Text>
          <Text style={styles.subtext}>
            We will send you an one time password on this mobile number
          </Text>
          <View style={{ width: "100%", marginTop: 40 }}>
            <Input
              label="Enter mobile number"
              onChangeText={handleTextChange}
              value={mobile}
            />
            <Button
              buttonStyle={{ padding: 10 }}
              radius={20}
              containerStyle={{ marginTop: 20 }}
              onPress={sendVerification}
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
