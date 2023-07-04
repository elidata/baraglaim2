import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  SafeAreaView,
} from "react-native";
import { db, auth } from "../FireBaseConsts";
import {
  deleteDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import HeaderIcons from "./HeaderIcons";
import Buttons from "./Buttons";
import { Ionicons } from "@expo/vector-icons";


const WatchMyChilds = ({ navigation }) => {
  const [kidsList, setKidsList] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchKidsList();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchKidsList = async () => {
    try {
      //get current user doc id:
      const currentUser = auth.currentUser;
      const q = query(
        collection(db, "Users"),
        where("uid", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const userDocRef = querySnapshot.docs[0];
      const userDocId = userDocRef.id;
      const children = userDocRef.data().children;

      let kidsData = [];
      await Promise.all( children.map(async (childId) => {
        const childDocRef = await getDoc(doc(db, "Children", childId));
        const childDocData = childDocRef.data();
        const schoolDocRef = await getDoc(
          doc(db, "School", childDocData.school)
        );
        const classesCollectionRef = collection(
          doc(db, "School", childDocData.school),
          "Classes"
        );
        const classDocRef = await getDoc(
          doc(classesCollectionRef, childDocData.class)
        );
        childDocData.school = schoolDocRef.data().name;
        childDocData.class = classDocRef.data().name;
        childDocData.id = childId;
        kidsData.push(childDocData);
      }));

      setKidsList(kidsData);
    } catch (error) {
      console.log("Error fetching kids list:", error);
    }
  };

  const handleAddChild = () => {
    navigation.navigate("AddChild");
  };

  const handleKidPress = (index) => {
    const selectedKid = kidsList[index];
    Alert.alert(
      "התראה",
      `${selectedKid.name}, ${selectedKid.school}, ${selectedKid.class}`,
      [
        {
          text: "לא",
          style: "cancel",
        },
      ]
    );
  };

  const handleDeleteChild = async (id) => {
    try {
      // Delete child item from the "Children" collection
      await deleteDoc(doc(db, "Children", id));

      // Delete child from the user's array of children
      const currentUser = auth.currentUser;
      const userQuerySnapshot = await getDocs(
        query(collection(db, "Users"), where("uid", "==", currentUser.uid))
      );
      const userDocRef = userQuerySnapshot.docs[0];
      const userDocId = userDocRef.id;
      const userDocData = userDocRef.data();

      // Remove the child ID from the user's array of children if it exists
      const updatedChildren = userDocData.children
        ? userDocData.children.filter((childId) => childId !== id)
        : [];

      // Update the user document in the "Users" collection
      await updateDoc(doc(db, "Users", userDocId), {
        children: updatedChildren,
      });

      // Remove the child from the "Groups" collection
      const groupsQuerySnapshot = await getDocs(collection(db, "Groups"));
      const groupsPromises = [];
      groupsQuerySnapshot.forEach((groupDoc) => {
        const groupData = groupDoc.data();
        const updatedGroupChildren = groupData.children.filter(
          (childId) => childId !== id
        );
        if (updatedGroupChildren.length !== groupData.children.length) {
          const groupDocRef = doc(db, "Groups", groupDoc.id);
          const updatePromise = updateDoc(groupDocRef, {
            children: updatedGroupChildren,
          });
          groupsPromises.push(updatePromise);
        }
      });
      await Promise.all(groupsPromises);

      // Fetch and update the kids' data after deleting the child
      fetchKidsList();
      // Show an alert for successful deletion
      Alert.alert("התראה", "הילד נמחק בהצלחה", [
        {
          text: "אישור",
          onPress: () => navigation.navigate("HomeScreen"), // Navigate to HomeScreen
        },
      ]);
    } catch (error) {
      console.log("Error deleting child:", error);
    }
  };

  const renderKid = ({ item, index }) => {
    const { id, name, school, class: kidClass } = item;

    return (
      <TouchableOpacity
        style={styles.kidContainer}
        onPress={() => handleKidPress(index)}
      >
        <View style={styles.kidRow}>
          <TouchableOpacity
            style={styles.deleteOpacity}
            onPress={() => handleDeleteChild(id)}
          >
            <Ionicons name="trash-outline" style={styles.deleteIcon} />
          </TouchableOpacity>
          <View style={styles.kidNameContainer}>
            <Text style={styles.kidName}>{name}</Text>
          </View>
        </View>
        <View style={styles.kidRow}>
          <Text style={styles.kidDetails}>{`${school}`}</Text>
        </View>
        <View style={styles.kidRow}>
          <Text style={styles.kidDetails}>{`${kidClass}`}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.overlay}>
        <Text style={styles.title}>צפה בילדים שלי</Text>
        <FlatList
          style={styles.kidsList}
          data={kidsList}
          renderItem={renderKid}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.kidsListContent}
        />
        <Buttons
          title="הוספת ילד/ה"
          color="#FFBF00"
          textColor="black"
          width={170}
          style={{ marginBottom: 80 }}
          press={handleAddChild}
        />
      </View>
      <HeaderIcons navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginTop: 30,
  },
  overlay: {
    backgroundColor: "#AED1EC",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
    color: "black",
  },
  kidsList: {
    width: "100%",
    backgroundColor: "#AED1EC",
  },
  kidsListContent: {
      flex: 1,
      // justifyContent: "center",
      marginTop: 30,
      width: "100%", // Add this line
  },
  kidContainer: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F5F5F5",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    width: "100%",
    alignSelf: "center",
    backgroundColor: "#F5F5F5",
  },
  kidRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  kidNameContainer: {
    alignItems: "center",
    flex: 1,
    alignItems: "flex-end",
  },
  kidName: {
    alignItems: "center",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 5,
    color: "#DCAB07",
  },
  kidDetails: {
    alignItems: "center",
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  deleteOpacity: {
    marginRight: 10,
  },
  deleteIcon: {
    color: "#B06363",
    fontSize: 30,
  },
});

export default WatchMyChilds;
