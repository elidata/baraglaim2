//--------------------------------- import area ----------------------------------
import React, { useState, useEffect } from "react";
import Buttons from "./Buttons";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import HeaderIcons from "./HeaderIcons";
import { db, auth } from "../FireBaseConsts";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
} from "firebase/firestore";
//import { set } from "date-fns";
import { MainStyles, Writings, Inputs } from "../styles/MainStyles";

const JoinWalkingGroup = ({ navigation }) => {
  //--------------------------------- define variables area ----------------------------------

  const [groupsList, setGroupsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //--------------------------------- Back-End area ----------------------------------
  /**
   * This function is called when the component is rendered.
   * It fetches the school data from Firestore.
   * @returns {void}
   */
  useEffect(() => {
    fetchGroupsList();
  }, []);

  /**
   * This function fetches the groups list from Firestore.
   * @returns {void}
   */
  async function fetchGroupsList() {
    try {
      setIsLoading(true);
      const currentUser = auth.currentUser;
      const q = query(
        collection(db, "Users"),
        where("uid", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const userDocRef = querySnapshot.docs[0];

      const childs = userDocRef.data().children;
      if (!childs) {
        setIsLoading(false);
        return;
      }
      const schoolList = [];
      await Promise.all(
        childs.map(async (child) => {
          const childDoc = doc(db, "Children", child);
          const childDocRef = await getDoc(childDoc);
          const school = childDocRef.data().school;
          if (!schoolList.includes(school)) {
            schoolList.push(school);
          }
        })
      );
      const q2 = query(
        collection(db, "Groups"),
        where("school", "in", schoolList)
      );
      const groupsCollection = await getDocs(q2);
      const groupsSnapshot = groupsCollection.docs;
      const groupsData = [];
      await Promise.all( groupsSnapshot.map(async (groupDoc) => {
        const managerID = groupDoc.data().busManager;
        const managerDocRef = doc(db, "Users", managerID);
        const managerDoc = await getDoc(managerDocRef);
        const managerName = managerDoc.data().username;
        const groupID = groupDoc.id;
        const name = groupDoc.data().busName;
        const school = groupDoc.data().school;
        const managerPhone = groupDoc.data().busManagerPhone;
        const startLocation = groupDoc.data().startLocation;
        const startTime = groupDoc.data().startTime;
        const maxCapacity = groupDoc.data().maxKids;
        const currentCapacity = groupDoc.data().children.length;
        const alreadyJoined = childs.some((child) => {
          return groupDoc.data().children.includes(child);
        });
        let haveChildToJoin = false;
        const kidsToJoin = [];
        await Promise.all( childs.map(async (child) => {
          const childDoc = doc(db, "Children", child);
          const childDocRef = await getDoc(childDoc);
          const school = childDocRef.data().school;
          if (school === groupDoc.data().school) {
            if (groupDoc.data().children.includes(child) === false) {
              haveChildToJoin = true;
              kidsToJoin.push({ id: child, name: childDocRef.data().name });
            }
          }
        }));
        const groupItem = {
          groupID: groupID,
          name: name,
          school: school,
          manager: managerName,
          managerPhone: managerPhone,
          startLocation: startLocation,
          startTime: startTime,
          maxCapacity: maxCapacity,
          currentCapacity: currentCapacity,
          alreadyJoined: alreadyJoined,
          haveChildToJoin: haveChildToJoin,
          kidsToJoin: kidsToJoin,
        };
        groupsData.push(groupItem);
      }));
      setGroupsList(groupsData);
      setIsLoading(false);
    } catch (error) {
      console.log("Error fetching group list:", error);
      setIsLoading(false);
    }
  }

  /**
   * This function is called when the user want to sign up a kid to a group.
   * @param {object} groupID - The group ID.
   * @param {object} index - The group index.
   * @returns {void}
   */
  const handleGroupPress = ({ groupID, kidsToJoin }) => {
    navigation.navigate("JoinCertainGroup", {
      groupID: groupID,
      childrenToJoin: kidsToJoin,
    });
  };

  const renderGroup = ({ item, index }) => {
    const { name, manager, managerPhone, startLocation } = item;
    return (
      <SafeAreaView style={styles.groupContainer}>
        <Text style={{color: "#DCAB07", fontWeight: "bold", fontSize: 20 }}>{name}</Text>
        <Text>מנהל: {manager}</Text>
        <Text>טלפון מנהל: {managerPhone}</Text>
        <Text>נקודת מפגש: {startLocation}</Text>
        <Text>שעת יציאה: {item.startTime}</Text>
        <Text>
          כמות משתתפים: {item.currentCapacity} / {item.maxCapacity}
        </Text>
        {item.currentCapacity == item.maxCapacity ? (
          <Text style={{ color: "#B06363", fontWeight: "bold" }}>הקבוצה מלאה</Text>
        ) : item.alreadyJoined ? (
          item.haveChildToJoin ? (
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: "green", fontWeight: "bold" }}>
                יש לך ילדים בקבוצה זו
              </Text>
              <Buttons
                title="הוסף לקבוצה"
                color="#FFBF00"
                textColor = "black"
                width={220}
                press={() =>
                  handleGroupPress({
                    groupID: item.groupID,
                    kidsToJoin: item.kidsToJoin,
                  })
                }
              />
            </View>
          ) : (
            <Text style={{ color: "#B06363", fontWeight: "bold" }}>
              אין לך ילדים להוסיף לקבוצה זו
            </Text>
          )
        ) : (
          <Buttons
            title="הצטרף לקבוצה"
            color="#FFBF00"
            textColor = "black"
            width={220}
            press={() =>
              handleGroupPress({
                groupID: item.groupID,
                kidsToJoin: item.kidsToJoin,
              })
            }
          />
        )}
      </SafeAreaView>
    );
  };

  // ------------------------Front-End area:------------------------

  return (
    <SafeAreaView style={MainStyles.page}>
      {isLoading ? (
        <View style={MainStyles.loadingContainer}>
          <Text style={ Writings.header }>המידע נטען...</Text>
          <ActivityIndicator size="large" color="#4682B4" />
        </View>
      ) : (
        <ScrollView style={{ marginBottom: 100 }}>
          <Text style={Writings.header}>קבוצות הליכה</Text>
          {groupsList.map((item, index) => (
            <View key={index}>{renderGroup({ item, index })}</View>
          ))}
        </ScrollView>
      )}
      <HeaderIcons navigation={navigation} />
    </SafeAreaView>
  );
};

//--------------------------------- style area ----------------------------------
const styles = StyleSheet.create({
  groupContainer: {
    alignItems: "center",
    textAlign: "center",
    textColor: "#999",
    // borderWidth: 1,
    // borderColor: "#F5F5F5",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    backgroundColor: "#F5F5F5",
  
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    marginTop: 50,
    
  },
  // groupName:{
  //   textColor: "#DCAB07",
  //   fontWeight: "bold",
  //   fontSize: 20 ,  
  // },
});

export default JoinWalkingGroup;
