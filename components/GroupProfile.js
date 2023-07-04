//--------------------------------- import area ----------------------------------
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
  FlatList,
  Linking,
  SafeAreaView,
} from "react-native";
import ListContainer from "./ListContainer";
import Buttons from "./Buttons";
import HeaderIcons from "./HeaderIcons";
import { db, auth } from "../FireBaseConsts";
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
import { useFocusEffect } from "@react-navigation/native";
import { MainStyles } from "../styles/MainStyles";
//import { fi } from "date-fns/locale";

const GroupProfile = ({ navigation, route }) => {
  // --------------------------------- define variables area ----------------------------------
  const [isLoading, setIsLoading] = useState(false);
  const [manager, setManager] = useState({});
  const [children, setChildren] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState({});
  const [userId, setUserId] = useState("");

  const group = route.params;

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(false);
      setIsModalVisible(false);
      fetchCalendar();
    }, [])
  );

  // --------------------------------- back-end area ----------------------------------
  useEffect(() => {
    fachingUsers();
  }, []);

  const fachingUsers = async () => {
    try {
      setIsLoading(true);
      const managerDoc = await getDoc(doc(db, "Users", group.busManager));
      setManager(managerDoc.data());
      let childrenDocs = [];
      await Promise.all(group.children.map(async (child) => {
        const childDoc = await getDoc(doc(db, "Children", child));
        const parentDoc = await getDoc(
          doc(db, "Users", childDoc.data().parent)
        );
        let childData = {
          name: childDoc.data().name,
          parentPhone: parentDoc.data().phone,
        };
        childrenDocs.push(childData);
      }));
      setChildren(childrenDocs);
      const currentUser = auth.currentUser;
      const q = query(
        collection(db, "Users"),
        where("uid", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const userDoc = querySnapshot.docs[0];
      setUserId(userDoc.id);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const fetchCalendar = async () => {
    try {
      setIsLoading(true);
      const groupDoc = await getDoc(doc(db, "Groups", group.id));
      const schedule = groupDoc.data().schedule;
      console.log(schedule);
      if (!schedule) {
        setCurrentSchedule({
          Sunday: "",
          Monday: "",
          Tuesday: "",
          Wednesday: "",
          Thursday: "",
          Friday: "",
        });
      } else {
        setCurrentSchedule(schedule);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handlePress = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleSchedulePress = async (day) => {
    console.log(day);
    setIsLoading(true);
    const groupDoc = await getDoc(doc(db, "Groups", group.id));
    let schedule = groupDoc.data().schedule;
    setIsLoading(false);
    if (!schedule) {
      schedule = {
        Sunday: "",
        Monday: "",
        Tuesday: "",
        Wednesday: "",
        Thursday: "",
        Friday: "",
      };
    }
    console.log(schedule);
    console.log(schedule[day]);
    if (schedule[day] === "") {
      Alert.alert(
        "אשר",
        "האם אתה רוצה להיות מלווה?",
        [
          {
            text: "לא",
            onPress: () => {
              setIsLoading(false);
            },
          },
          {
            text: "כן",
            onPress: async () => {
              setIsLoading(true);
              schedule[day] = userId;
              await updateDoc(doc(db, "Groups", group.id), {
                schedule: schedule,
              });
              fetchCalendar();
              setIsLoading(false);
            },
          },
        ],
        { cancelable: false }
      );
    } else if (schedule[day] === userId) {
      Alert.alert(
        "אשר",
        "האם אתה רוצה להסיר את עצמך מהמלווים?",
        [
          {
            text: "לא",
            onPress: () => {
              setIsLoading(false);
            },
          },
          {
            text: "כן",
            onPress: async () => {
              setIsLoading(true);
              schedule[day] = "";
              await updateDoc(doc(db, "Groups", group.id), {
                schedule: schedule,
              });
              fetchCalendar();
              setIsLoading(false);
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert("אשר", "קיים כבר מלווה ליום זה, האם אתה רוצה לצפות בפרטיו?", [
        {
          text: "לא",
          onPress: () => {
            setIsLoading(false);
          },
        },
        {
          text: "כן",
          onPress: async () => {
            navigation.navigate("UserProfile", { userId: schedule[day] });
            // Alert.alert(
            //   "אשר",
            //   "פרטים בהמשך",
            //   [
            //     {
            //       text: "אישור",
            //       onPress: () => {
            //         setIsLoading(false);
            //       },
            //     },
            //   ],
            //   { cancelable: false }
            // );
          },
        },
      ]);
    }
  };

  // --------------------------------- front-end area ----------------------------------
  function DayCard({day, name}) {
    console.log(day);
    return (
      <TouchableOpacity
        style={styles.dayCard}
        onPress={() => handleSchedulePress(day)}
      >
        <Text style={[styles.regular, { fontWeight: "bold" }]}>{name}</Text>
        <View style={styles.companionContainer}>
          {currentSchedule[day] === "" ? (
            <View>
              <Text style={[styles.regular, { color: "grey" }]}>
                ביום זה אין מלווים
              </Text>
              <Text style={[styles.regular, { color: "orange" }]}>
                לחץ להצעת מלווה
              </Text>
            </View>
          ) : (
            <View>
              {currentSchedule[day] === userId ? (
                <View>
                  <Text style={[styles.regular, { color: "#72B56A" }]}>
                    אתה מלווה ביום זה
                  </Text>
                  <Text style={[styles.regular, { color: "#72B56A" }]}>
                    לחץ להסרת עצמך מהמלווים
                  </Text>
                </View>
              ) : (
                <View>
                  <Text style={[styles.regular, { color: "#B56A77" }]}>
                    ביום זה קיים כבר מלווה
                  </Text>
                      <Text style={[styles.regular, { color: "#B65FCF" }]}>
                    לחץ לצפייה בפרטיו
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={MainStyles.page}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.header}>טוען נתונים...</Text>
          <ActivityIndicator size="large" color="#4682B4" />
        </View>
      ) : (
        <ScrollView style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>{group.busName}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.regular}>{manager.username}</Text>
            <Text style={styles.regular}>מנהל האוטובוס:</Text>
          </View>
          <View style={styles.textContainer}>
            <Text
              style={[styles.regular, { color: "blue" }]}
              onPress={() => handlePress(group.busManagerPhone)}
            >
              {group.busManagerPhone}
            </Text>
            <Text style={styles.regular}>טלפון:</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.regular}>{group.schoolName}</Text>
            <Text style={styles.regular}>מוסד חינוך:</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.regular}>{group.startLocation}</Text>
            <Text style={styles.regular}>מיקום התחלה:</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.regular}>{group.startTime}</Text>
          <Text style={styles.regular}>שעת התחלה:</Text>
          </View>
          <View style={styles.textContainer}>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => setIsModalVisible(true)}
            >
              <Text style={styles.regular}>
                {" "}
                {children.length} / {group.maxKids}
              </Text>
              <Text style={styles.regular}>רשימת משתתפים:</Text>
              
            </TouchableOpacity>
          </View>
          <View style={styles.textContainer}>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => setScheduleModalVisible(true)}
            >
            <Text style={styles.regular}>לוח זמנים</Text>
            </TouchableOpacity>
          </View>
          <Modal
            animationType="none"
            visible={isModalVisible}
            style={styles.modal}
            onRequestClose={() => {
              setIsModalVisible(!isModalVisible);
            }}
          >
            <SafeAreaView style={styles.modalContainer}>
              <View style={styles.modalContentContainer}>
                <View style={styles.modalHeaderContainer}>
                  <Text style={styles.modalHeader}>רשימת משתתפים</Text>
                </View>
                <View style={styles.ListsContainer}>
                  <ListContainer
                    data={children.map((child) => {
                      return (
                        <View key={child.id} style={styles.textContainer}>
                          <View style={styles.fieldContainer}>
                            <Text style={styles.regular}>פלאפון ההורה:</Text>
                            <Text
                              style={[styles.regular, { color: "blue" }]}
                              onPress={() => handlePress(child.parentPhone)}
                            >
                              {child.parentPhone}
                            </Text>
                          </View>
                          <View style={styles.fieldContainer}>
                            <Text style={styles.regular}>שם:</Text>
                            <Text style={styles.regular}>{child.name}</Text>
                          </View>
                        </View>
                      );
                    })}
                    height={0.7}
                    width={0.8}
                    style={{ marginBottom: 100 }}
                  />
                </View>
                <Buttons
                  title="סגור"
                  color="#FFBF00"
                  textColor= "black"
                  width={200}
                  press={() => setIsModalVisible(!isModalVisible)}
                  style={{ marginBottom: 20 }}
                />
              </View>
            </SafeAreaView>
          </Modal>
          <Modal
            animationType="none"
            visible={scheduleModalVisible}
            style={styles.modal}
            onRequestClose={() => {
              setScheduleModalVisible(!scheduleModalVisible);
            }}
          >
            <SafeAreaView style={styles.modalContainer}>
              <View style={styles.modalContentContainer}>
                <View style={styles.modalHeaderContainer}>
                  <Text style={styles.modalHeader}>לוח זמנים</Text>
                </View>
                <ScrollView style={styles.daysCard}>
                  <DayCard {...{ day: "Sunday", name: "ראשון" }} />
                  <DayCard {...{ day: "Monday", name: "שני" }} />
                  <DayCard {...{ day: "Tuesday", name: "שלישי" }} />
                  <DayCard {...{ day: "Wednesday", name: "רביעי" }} />
                  <DayCard {...{ day: "Thursday", name: "חמישי" }} />
                  <DayCard {...{ day: "Friday", name: "שישי" }} />
                </ScrollView>
              </View>
              <Buttons
                title="סגור"
                color="#FFBF00"
                textColor= "black"
                width={200}
                press={() => setScheduleModalVisible(!scheduleModalVisible)}
                style={{ marginBottom: 20 }}
              />
            </SafeAreaView>
          </Modal>
        </ScrollView>
      )}
      <HeaderIcons navigation={navigation} />
    </SafeAreaView>
  );
};

// --------------------------------- style area ----------------------------------
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#AED1EC",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#AED1EC",
    // textDecorationLine: "underline",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#AED1EC",
    marginBottom: 100,
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    // justifyContent: "space-between",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderColor: "#F5F5F5",
    marginBottom: 15,
    borderWidth: 1,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderColor: "#f5f5f5",
    borderWidth: 1, 
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: -4, height: -4 },
    shadowOpacity: 0.2,
  },
  headerContainer: {
    fontSize: 24,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#AED1EC",
    margin: 60,
  },
  regular: {
    fontSize: 17,
    textAlign: "center",
    margin: 10,
  },
  modal: {
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#AED1EC",
    borderColor: "#AED1EC",
  },
  modalContentContainer: {
    flex: 1,
    backgroundColor: "#AED1EC",
  },
  modalHeaderContainer: {
    margin: 30,
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  ListsContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#AED1EC",
  },
  fieldContainer: {
    flex: 1,
    flexDirection: "column",
    width: 150,
  },
  daysCard: {
    flex: 1,
    flexDirection: "column",
    marginHorizontal: 10,
  },
  dayCard: {
    flex: 1,
    width: "95%",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: -4, height: -4 },
    shadowOpacity: 0.2,
    margin: 10,
  },
  companionContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GroupProfile;
