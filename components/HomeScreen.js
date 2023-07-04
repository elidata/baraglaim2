import React, { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, SafeAreaView } from "react-native";
 import { db,auth } from "../FireBaseConsts.js";
import { collection, query, getDocs, where } from "firebase/firestore";
import HeaderIcons from "./HeaderIcons";
import Buttons from "./Buttons";

const HomeScreen = ({ navigation, route }) => {
  const { username} = route.params;
  const [isAdmin, setIsAdmin] = useState(false);
  const [userDataLoaded, setUserDataLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = auth.currentUser;
        const q = query(
          collection(db, "Users"),
          where("uid", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const userDocRef = querySnapshot.docs[0];
        console.log("isAdmin:", userDocRef.data().isAdmin); // Debugging
        setIsAdmin(userDocRef.data().isAdmin);
        const usersRef = collection(db,"Users");
        console.log("usersRef:", usersRef); // Debugging

      } catch (error) {
        console.error("Failed to retrieve user data:", error);
      } finally {
        setUserDataLoaded(true);
      }
    };

    fetchData();
  }, [username]);


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>ברוך הבא {username}</Text>
      <View style={styles.overlay}>
        <Buttons
          title="הוסף ילד"
          color="#FFBF00"
          textColor="black"
          width={200}
          press={() => navigation.navigate("AddChild")}
        />
        <Buttons
          title="הילדים שלי"
          color="#FFBF00"
          textColor="black"
          width={200}
          press={() => navigation.navigate("WatchMyChilds")}
        />
        <Buttons
          title="קבוצות הליכה"
          color="#FFBF00"
          textColor="black"
          width={200}
          press={() => navigation.navigate("MyWalkingGroup")}
        />
        <Buttons
          title="הקהילות שלי"
          color="#FFBF00"
          textColor="black"
          width={200}
          press={() => navigation.navigate("MyCommunity")}
        />
        {userDataLoaded && isAdmin && (
          <Buttons
            title="צור קהילה"
            color="#EA3B52"
            textColor="black"
            width={200}
            press={() => navigation.navigate("CreateCommunity")}
          />
        )}
      </View>
      <HeaderIcons navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  overlay: {
    backgroundColor: "#96CCE4",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
});

export default HomeScreen;
