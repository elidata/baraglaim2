//---------------------------------------------------------- imports area: ----------------------------------------------------------
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { db } from "../FireBaseConsts";
import Buttons from "./Buttons";
import { query, addDoc, collection, getDocs, where } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
//import { set } from "date-fns";

//---------------------------------------------------------- variable definition area: ----------------------------------------------------------
const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setEmail("");
      setPassword("");
      setErrorMessage("");
      setIsLoading(false);
    }, [])
  );

  //---------------------------------------------------------- Back-End area: ----------------------------------------------------------
  const handleLogin = async () => {
    setIsLoading(true);
    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Login successful
      const user = userCredential.user;
      console.log("Logged in user:", user.uid);
      const userUid = user.uid;
      const q = query(collection(db, "Users"), where("uid", "==", userUid));
      const querySnapshot = await getDocs(q);
      console.log(
        "Logged in user name:",
        querySnapshot.docs[0].data().username
      );

      if (querySnapshot.empty) {
        Alert.alert("שגיאה", "משתמש לא קיים במערכת", [{ text: "אישור" }]);
        setIsLoading(false);
        return;
      }

      await navigation.navigate("HomeScreen", {
        username: querySnapshot.docs[0].data().username,
      });
    } catch (error) {
      const errorMessage = error.message;
      setErrorMessage(errorMessage);
      setIsLoading(false);
    }
  };
  //---------------------------------------------------------- Front-End area: ----------------------------------------------------------
  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.header}>כמה רגעים...</Text>
          <ActivityIndicator size="large" color="#F5F5F5" />
        </View>
      ) : (
        <SafeAreaView style={styles.container}>
          <View style={styles.overlay}>
            <Text style={styles.header}>אוטובוס הליכה</Text>
            <Text style={styles.userDetails}>מייל</Text>
            <TextInput
              style={[styles.input, { color: "black" }]}
              placeholder="מייל"
              maxLength={50}
              numberOfLines={1}
              onChangeText={(text) => setEmail(text)}
            />
            <Text style={styles.userDetails}>סיסמא</Text>
            <TextInput
              style={[styles.input, styles.marginBottom, { color: "black" }]}
              placeholder="סיסמא"
              secureTextEntry={true}
              maxLength={50}
              numberOfLines={1}
              onChangeText={(text) => setPassword(text)}
            />
            <Buttons
              title="התחברות"
              color="#FFBF00"
              textColor="black"
              width={150}
              press={handleLogin}
            />
            {errorMessage ? (
              <Text style={styles.error}>{errorMessage}</Text>
            ) : null}
            <View style={styles.signupContainer}>
              <Text style={styles.signupNow}>אין לך חשבון? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("RegisterPage")}
              >
                <Text style={[styles.signupLink]}>להרשמה</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
};

//---------------------------------------------------------- style area: ----------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#AED1EC",
  },
  overlay: {
    backgroundColor: "#AED1EC",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  userDetails: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    width: 300,
    height: 50,
    textAlign: "center",
    alignSelf: "center",
    padding: 10,
  },
  marginBottom: {
    marginBottom: 20,
  },

  error: {
    fontSize: 18,
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
  signupContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  signupNow: {
    fontSize: 15,
    color: "black",
  },
  signupLink: {
    textDecorationLine: "underline",
    color: "#1F456E",
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default LoginPage;
