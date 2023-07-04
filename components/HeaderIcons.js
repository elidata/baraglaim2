import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
  Platform,
} from "react-native";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { db, auth } from "../FireBaseConsts";

const HeaderIcons = ({ navigation }) => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const currentUser = auth.currentUser;
    const q = query(
      collection(db, "Users"),
      where("uid", "==", currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    const user = querySnapshot.docs[0];
    setUsername(user.data().username);
  };

  return (
    <View style={styles.footerContainer}>
      <View
        style={[
          styles.navigationBar,
          Platform.OS === "ios" && styles.navigationBarIOS,
        ]}
      >
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() =>
              navigation.navigate("HomeScreen", { username: username })
            }
          >
            <View style={styles.iconWrapper}>
              <Ionicons name="home-outline" size={30} color="black" />
              <Text style={styles.iconText}>דף</Text>
              <Text style={styles.iconText}>הבית</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate("MyCommunity")}
          >
            <View style={styles.iconWrapper}>
              <Ionicons name="school-outline" size={30} color="black" />
              <Text style={styles.iconText}>הקהילות</Text>
              <Text style={styles.iconText}>שלי</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate("WalkingGroups")}
          >
            <View style={styles.iconWrapper}>
              <Ionicons name="walk-outline" size={30} color="black" />
              <Text style={styles.iconText}>קבוצות</Text>
              <Text style={styles.iconText}>הליכה</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate("WatchMyChilds")}
          >
            <View style={styles.iconWrapper}>
              <Ionicons name="people-outline" size={30} color="black" />
              <Text style={styles.iconText}>הילדים</Text>
              <Text style={styles.iconText}>שלי</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate("AddChild")}
          >
            <View style={styles.iconWrapper}>
              <Ionicons name="person-add-outline" size={30} color="black" />
              <Text style={styles.iconText}>הוסף</Text>
              <Text style={styles.iconText}>ילד</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate("LoginPage")}
          >
            <View style={styles.iconWrapper}>
              <Ionicons name="log-out-outline" size={30} color="black" />
              <Text style={styles.iconText}>התנתק</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#ECECEC",
    paddingBottom:  Platform.OS === "ios" ? 20 : 5,
  },
  navigationBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 20 : 5,
  },
  navigationBarIOS: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    flexDirection: "row-reverse",
    paddingTop: 20,
  },
  iconContainer: {
    alignItems: "center",
  },
  iconWrapper: {
    alignItems: "center",
  },
  iconText: {
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
    textAlignVertical: "center", // Add this line for consistent icon directionality
  },
  headerButton: {
    backgroundColor: "#F3F3F3",
    shadowColor: "black",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    borderRadius: 10,
    width: 50,
    height: Platform.OS === "ios" ? 70 : 75,
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5, // Add this line for Android shadow
  },
});

export default HeaderIcons;
