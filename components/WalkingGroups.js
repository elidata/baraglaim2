import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import HeaderIcons from "./HeaderIcons";
import Buttons from "./Buttons";
import CreateWalkingGroup from "./CreateWalkingGroup";

const WalkingGroups = ({ navigation }) => {
  // const [showForm, setShowForm] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.overlay}>
        <View>
          <Buttons
            title="האוטובוסים שלי"
            color="#FFBF00"
            textColor = "black"
            width={300}
            press={() => navigation.navigate("MyWalkingGroup")}
          />
          <Buttons
            title="הצטרף לאוטובוס הליכה"
            color="#FFBF00"
            textColor = "black"
            width={300}
            press={() => navigation.navigate("JoinWalkingGroup")}
          />
          <Buttons
            title="צור אוטובוס הליכה חדש"
            color="#FFBF00"
            textColor = "black"
            width={300}
            press={() => navigation.navigate("CreateWalkingGroup")}
          />
        </View>
      </View>
      <HeaderIcons navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  overlay: {
    backgroundColor: "#AED1EC",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // buttonsContainer: {
  //   flexDirection: "column",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   height: "100%",
  // },
  // button: {
  //   backgroundColor: "#1E6738",
  //   width: "80%",
  //   height: 50,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   marginVertical: 10,
  //   borderRadius: 5,
  // },
  buttonText: {
    color: "black",
    fontSize: 18,
  },
});

export default WalkingGroups;
