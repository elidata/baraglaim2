import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Dimensions,
} from "react-native";
import Footer from "./Footer";
// import RegisterPage from "./RegisterPage";

const WelcomePage = ({ navigation, route }) => {
  const { username } = route.params;

  const handleContinue = () => {
    navigation.navigate("HomeScreen", { username });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.overlay}>
        <Text style={styles.header}>ברוך הבא {username}!</Text>
        <Text style={styles.subheader}>אנחנו שמחים שהצטרפת אלינו</Text>
        <Text style={styles.description}>תהליך ההרשמה הסתיים בהצלחה.</Text>
        <Text style={styles.description}>
          מוכן להתחיל לגלות ולחקור את השכונה שלך?
        </Text>
        <Text style={styles.description}>לחץ על המשך ותתחיל ללכת!!</Text>
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText} onPress={handleContinue}>
            המשך
          </Text>
        </View>
      </View>
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    color: "white",
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subheader: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  buttonContainer: {
    backgroundColor: "orange",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default WelcomePage;
