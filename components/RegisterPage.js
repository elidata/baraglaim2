import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView
} from "react-native";
//import { ScrollView } from "react-native-gesture-handler";
import Buttons from "./Buttons";
import { addDoc, collection, query, getDocs, where } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../FireBaseConsts.js"; // Adjust the import statement

const RegisterPage = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  //const [adminCode, setAdminCode] = useState(""); // New state for admin code
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegistration = async () => {
    try {
      setIsLoading(true);
      if (
        username === "" ||
        email === "" ||
        password === "" ||
        confirmPassword === "" ||
        address === "" ||
        phone === ""
      ) {
        Alert.alert("שגיאה", "אנא מלא את כל השדות", [{ text: "אישור" }]);
        setIsLoading(false);
        return;
      }
      if (email.indexOf("@") === -1) {
        Alert.alert("שגיאה", "כתובת אימייל לא תקינה", [{ text: "אישור" }]);
        setIsLoading(false);
        return;
      }
      if (phone.length !== 10) {
        Alert.alert("שגיאה", "מספר טלפון לא תקין", [{ text: "אישור" }]);
        setIsLoading(false);
        return;
      }
      if (
        password.length < 6 ||
        confirmPassword.length < 6 ||
        password.length > 50 ||
        confirmPassword.length > 50
      ) {
        Alert.alert(
          "שגיאה",
          " סיסמא חייבת להיות באורך 6 תווים לפחות ועד 50 תווים",
          [{ text: "אישור" }]
        );
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match");
        setIsLoading(false);
        return;
      }

      // if (adminCode !== "123123" && adminCode !== "0") {
      //   Alert.alert("שגיאה", "קוד מנהל לא תקין", [{ text: "אישור" }]);
      //   setIsLoading(false);
      //   return;
      // }

      
      

      const q = query(collection(db, "Users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        alert("משתמש עם כתובת האימייל הזו כבר קיים במערכת");
        setIsLoading(false);
        return;
      }
      const q2 = query(
        collection(db, "Users"),
        where("username", "==", username)
      );
      const querySnapshot2 = await getDocs(q2);
      if (!querySnapshot2.empty) {
        alert("שם משתמש כבר קיים במערכת");
        setIsLoading(false);
        return;
      }

      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      const docRef = await addDoc(collection(db, "Users"), {
        uid: uid,
        username: username,
        email: email,
        address: address,
        phone: phone,
        // isAdmin: adminCode === "123123",
      });

      setIsLoading(false);
      navigation.navigate("WelcomePage", { username }); // Pass username to WelcomePage
    } catch (error) {
      console.error("Error adding document: ", error);
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigation.navigate("LoginPage");
  };
  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.header}>כמה רגעים...</Text>
          <ActivityIndicator size="large" color="#F5F5F5" />
        </View>
      ) : (
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <Text style={styles.header}>הרשמה</Text>
            <Text style={styles.userDetails}>שם משתמש</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { color: "black" }]}
                placeholder="שם משתמש"
                value={username}
                onChangeText={setUsername}
                maxLength={50}
                minLength={3}
                numberOfLines={1}
              />
            </View>
            <Text style={styles.userDetails}>כתובת אימייל</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { color: "black" }]}
                placeholder="אימייל"
                value={email}
                onChangeText={setEmail}
                maxLength={50}
                minLength={5}
                numberOfLines={1}
              />
            </View>
            <Text style={styles.userDetails}>טלפון</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { color: "black" }]}
                placeholder="טלפון"
                value={phone}
                onChangeText={setPhone}
                maxLength={10}
                numberOfLines={1}
                keyboardType="numeric"
              />
            </View>
            <Text style={styles.userDetails}>כתובת מגורים</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { color: "black" }]}
                placeholder="כתובת מגורים"
                value={address}
                onChangeText={setAddress}
                maxLength={50}
                numberOfLines={1}
              />
            </View>
            <Text style={styles.userDetails}>סיסמא</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { color: "black" }]}
                placeholder="סיסמא"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                maxLength={50}
                numberOfLines={1}
              />
            </View>
            <Text style={styles.userDetails}>אימות סיסמא</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.marginBottom, { color: "black" }]}
                placeholder="אימות סיסמא"
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                maxLength={50}
                numberOfLines={1}  
              />
            </View>
              {/* <Text style={styles.userDetails}>קוד מנהל</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, styles.marginBottom, { color: "black" }]}
                  placeholder="אם אין הכנס 0"
                  secureTextEntry={true}
                  value={adminCode}
                  onChangeText={setAdminCode}
                  maxLength={50}
                  numberOfLines={1}
                />
              </View> */}
            <Buttons
              title="הרשמה"
              color="#FFBF00"
              textColor="black"
              width={150}
              press={handleRegistration}
            />
            {/* Add the button for navigating to the login page */}
            <TouchableOpacity onPress={handleGoToLogin}>
              <Text style={styles.loginLink}>נזכרתי שיש לי כבר חשבון</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#AED1EC",
    marginTop: 45,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#96CCE4",
  },
  header: {
    color: "black",
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 2,
    textAlign: "center",
  },
  userDetails: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    width: 300,
    height: 40,
    textAlign: "center",
    alignSelf: "center",
    padding: 10,
  },
  marginBottom: {
    marginBottom: 20,
  },
  loginLink: {
    color: "#1F456E",
    fontSize: 16,
    textAlign: "center",
    textDecorationLine: "underline",
    marginTop: 10,
  },
});

export default RegisterPage;
