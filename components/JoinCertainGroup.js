//--------------------------------- import area ----------------------------------
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import Footer from "./Footer";
import HeaderIcons from "./HeaderIcons";
import { db, auth } from "../FireBaseConsts";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { Picker } from "@react-native-picker/picker";
import Buttons from "./Buttons";
import { MainStyles, Writings, Inputs } from "../styles/MainStyles";

const JoinCertainGroup = ({ navigation, route }) => {
  //--------------------------------- define variables area ----------------------------------

  const [isLoading, setIsLoading] = useState(false);
  const [child, setChild] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const groupId = route.params.groupID;
  const childrenToJoin = route.params.childrenToJoin;
  //--------------------------------- Back-End area ----------------------------------
 

  /**
   * This function is handling the join group button.
   * It adds the group to the user's groups array and adds the child to the group's children array.
   * @returns {void}
   */
  handleJoin = async () => {
    try {
      setIsLoading(true);
      if (!child || child === "") {
        alert("בחר/י ילד/ה");
        setIsLoading(false);
        return;
      }
      const currentUser = auth.currentUser;
      const q = query(
        collection(db, "Users"),
        where("uid", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const userDocRef = querySnapshot.docs[0];
      let groupsArray = userDocRef.data().groups;
      if (!groupsArray) {
        groupsArray = [];
      }
      if (!groupsArray || !groupsArray.includes(groupId)) {
        groupsArray.push(groupId);
        await updateDoc(doc(db, "Users", userDocRef.id), {
          groups: groupsArray,
        });
      }
      const groupDocRef = await getDoc(doc(db, "Groups", groupId));
      let childrenArray = groupDocRef.data().children;
      if(groupDocRef.data().maxKids <= childrenArray.length){
        Alert.alert("הקבוצה מלאה", "הקבוצה מלאה, אנא בחר/י קבוצה אחרת", [{ text: "אישור" }], { cancelable: false });
        setIsLoading(false);
        return;
      }
      await updateDoc(doc(db, "Groups", groupId), {
        children: [...childrenArray, child],
      });
      setIsLoading(false);
      navigation.navigate("MyWalkingGroup");
    } catch (error) {
      console.log("Error joining group:", error);
      setIsLoading(false);
    }
  };

  // --------------------------------- functions area ----------------------------------
  const selectChild = (itemValue) => {
    setChild(itemValue);
  };
  // ------------------------Front-End area:------------------------

  return (
    <SafeAreaView style={MainStyles.page}>
      {isLoading ? (
        <View style={MainStyles.loadingContainer}>
          <Text style={Writings.header}>המידע נטען...</Text>
          <ActivityIndicator size="large" color="#4682B4" />
        </View>
      ) : (
        <View>
          <Text style={Writings.header}>הצטרפות לאוטובוס</Text>
          {Platform.OS === "ios" ? (
            <View>
              <Text style={MainStyles.label}>בחר/י ילד/ה</Text>
              <TouchableOpacity
                style={Inputs.input}
                onPress={() => setIsModalVisible(true)}
              >
                <Text styles={{ textAlign: "right" }}>
                  {selectedValue ? selectedValue : "בחר/י ילד/ה"}
                </Text>
              </TouchableOpacity>
              <Modal
                animationType="slide"
                visible={isModalVisible}
                onRequestClose={() => {
                  setIsModalVisible(!isModalVisible);
                }}
              >
                <SafeAreaView style={styles.modalContainer}>
                  <FlatList
                    style={{ width: "100%", height: 300 }}
                    data={childrenToJoin}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.optionContainer}
                        onPress={() => {
                          setSelectedValue(item.name);
                          selectChild(item.id);
                          setIsModalVisible(!isModalVisible);
                        }}
                      >
                        <Text style={styles.optionText}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id}
                  />
                </SafeAreaView>
                <Buttons
                  title="סגור"
                  color="#B06363"
                  width={200}
                  press={() => setIsModalVisible(!isModalVisible)}
                  style={{ marginBottom: 100 }}
                />
              </Modal>
            </View>
          ) : (
            <View style={Inputs.inputContainer}>
              <Picker
                style={Inputs.input}
                selectedValue={child}
                onValueChange={selectChild}
              >
                <Picker.Item label="בחר/י ילד/ה" value="" />
                {childrenToJoin.map((child) => (
                  <Picker.Item
                    key={child.id}
                    label={child.name}
                    value={child.id}
                  />
                ))}
              </Picker>
            </View>
          )}
        </View>
      )}
      <Buttons
        title="הצטרפ/י"
        color="#FFBF00"
        textColor="black"
        // width={170}
        style={{ marginBottom: 80 }}
        width={200}
        press={() => handleJoin()}
      />
      <HeaderIcons navigation={navigation} />
    </SafeAreaView>
  );
};

//--------------------------------- style area ----------------------------------
const styles = StyleSheet.create({
  modalContainer: {
    marginTop: "10%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "F5F5F5",
  },
  optionContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
  },
  optionText: {
    fontSize: 30,
  },
});

export default JoinCertainGroup;
