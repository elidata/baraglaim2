import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity, // Add this import
  Linking,
} from "react-native";
import HeaderIcons from "./HeaderIcons";

const SchoolProfile = ({ navigation, route }) => {
  const { name, phone, address } = route.params;

  const handlePress = () => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.header}>{name}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.regular}>טלפון:</Text>
          <TouchableOpacity onPress={handlePress}>
            <Text style={[styles.regular, { color: "blue" }]}>{phone}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.regular}>כתובת:</Text>
          <Text style={styles.regular}>{address}</Text>
        </View>
      </ScrollView>
      <HeaderIcons navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 100,

  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#AED1EC",
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#AED1EC",
    
  },
  regular: {
    fontSize: 20,
    textAlign: "right",
    margin: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#999",
    fontStyle: "italic",
    lineHeight: 24,
  },
});

export default SchoolProfile;
