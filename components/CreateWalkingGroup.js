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
  SafeAreaView,
} from "react-native";
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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import Icon from "react-native-vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker";

const CreateWalkingGroup = ({ navigation }) => {
  //--------------------------------- define variables area ----------------------------------
  const [busName, setBusName] = useState("");
  const [busMaxKids, setBusMaxKids] = useState("");
  const [busStartLocation, setBusStartLocation] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [school, setSchool] = useState("");
  const [schoolList, setSchoolList] = useState([]);
  const [child, setChild] = useState("");
  const [childList, setChildList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formattedTime, setFormattedTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  //--------------------------------- Back-End area ----------------------------------
  /**
   * This function is called when the component is rendered.
   * It fetches the school data from Firestore.
   * @returns {void}
   */
  useEffect(() => {
    fetchChilds();
  }, []);

  /**
   * This function fetches the childs data from Firestore.
   * @returns {void}
   * @throws {error} error - Firebase error
   */
  async function fetchChilds() {
    setIsLoading(true);
    try {
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
      const childsList = [];
      await Promise.all( childs.map(async (child) => {
        const childDoc = doc(db, "Children", child);
        const childDocRef = await getDoc(childDoc);
        const name = childDocRef.data().name;
        const school = childDocRef.data().school;
        childsList.push({ id: childDocRef.id, name: name, school: school });
      }));
      setChildList(childsList);
      setIsLoading(false);
    } catch (error) {
      console.log("Error fetching childs data:", error);
      setIsLoading(false);
    }
  }

  /**
   * This function adds the walking group to the DB.
   * @returns {void}
   * @throws {error} error - Firebase error
   */
  async function addWalkingGroupToDB() {
    setIsLoading(true);
    if (childList.length === 0) {
      Alert.alert("שגיאה", "אין לך ילדים רשומים, אנא הוסף ילד וחזור לנסות", [
        { text: "הבנתי" },
      ]);
      setIsLoading(false);
      return;
    }
    if (busName === "") {
      Alert.alert("שגיאה", "אנא הכנס/י שם לקבוצה", [{ text: "הבנתי" }]);
      setIsLoading(false);
      return;
    }
    if (busMaxKids > 30 || busMaxKids < 1 || busMaxKids === "") {
      Alert.alert("שגיאה", "אנא הכנס/י מספר ילדים מרבי בין 1 ל-30", [
        { text: "הבנתי" },
      ]);
      setIsLoading(false);
      return;
    }
    if (busStartLocation === "") {
      Alert.alert("שגיאה", "אנא הכנס/י מקום יציאה", [{ text: "הבנתי" }]);
      setIsLoading(false);
      return;
    }
    if (formattedTime === "") {
      Alert.alert("שגיאה", "אנא הכנס/י שעת יציאה", [{ text: "הבנתי" }]);
      setIsLoading(false);
      return;
    }
    if (school === "") {
      Alert.alert("שגיאה", "אנא בחר/י בית ספר", [{ text: "הבנתי" }]);
      setIsLoading(false);
      return;
    }
    if (child === "") {
      Alert.alert("שגיאה", "אנא בחר/י ילד", [{ text: "הבנתי" }]);
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
    const userDocId = userDocRef.id;
    const groupDocRef = await addDoc(collection(db, "Groups"), {
      busName: busName,
      busManager: userDocId,
      busManagerPhone: userDocRef.data().phone,
      maxKids: busMaxKids,
      startLocation: busStartLocation,
      startTime: formattedTime,
      school: school,
      children: [child],
    });
    const groupDocId = groupDocRef.id;
    if (userDocRef.data().groups) {
      updateDoc(doc(db, `Users/${userDocId}`), {
        groups: [...userDocRef.data().groups, groupDocId],
      });
    } else {
      updateDoc(doc(db, `Users/${userDocId}`), {
        groups: [groupDocId],
      });
    }
    setIsLoading(false);
    Alert.alert("הקבוצה נוצרה בהצלחה!", "ברכותינו", [{ text: "אישור" }]);
    navigation.navigate("MyWalkingGroup", {
      username: userDocRef.data().username,
    });
  }

  // ------------------------funcions area:------------------------
  /**
   * This function is called when the user selects a time from the time picker.
   * @param {Date} selectedDate - The selected date
   * @returns {void}
   */
  const handleDateChange = (selectedDate) => {
    setSelectedDate(selectedDate);
    setFormattedTime(format(selectedDate, "HH:mm"));
    setShowPicker(false);
  };

  /**
   * This function is called when the user presses the time picker.
   * It shows the time picker.
   * @returns {void}
   */
  function showDateTimePicker() {
    setShowPicker(true);
  }

  /**
   * This function is called when the user selects a school from the school picker.
   * @param {string} itemValue - The selected school id
   * @returns {void}
   */
  const selectSchool = (itemValue) => {
    setSchool(itemValue);
  };

  /**
   * This function is called when the user selects a child from the child picker.
   * @param {string} itemValue - The selected child id
   * @returns {void}
   */
  const selectChild = (itemValue) => {
    setChild(itemValue);
    if (itemValue) {
      setSchool(childList.find((child) => child.id === itemValue).school);
    }
  };

  // ------------------------Front-End area:------------------------
  return (
    // ------------------------JSX area:------------------------
    <SafeAreaView style={styles.page}>
      <HeaderIcons navigation={navigation} />
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.header}>טוען נתונים...</Text>
          <ActivityIndicator size="large" color="#4682B4" />
        </View>
      ) : (
        <ScrollView style={styles.formContainer}>
          <Text style={styles.title}>יצירת אוטובוס הליכה</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>שם הקבוצה</Text>
            <TextInput
              style={styles.input}
              value={busName}
              onChangeText={setBusName}
              placeholder="הקלד/י שם לקבוצה"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>מספר ילדים מרבי</Text>
            <TextInput
              style={styles.input}
              value={busMaxKids}
              onChangeText={setBusMaxKids}
              placeholder="הקלד/י את מספר הילדים המרבי"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>מקום יציאה</Text>
            <TextInput
              style={styles.input}
              value={busStartLocation}
              onChangeText={setBusStartLocation}
              placeholder="הקלד/י מקום יציאה"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>שעת יציאה</Text>
            <TouchableOpacity style={styles.input} onPress={showDateTimePicker}>
              <Icon name="clock-o" size={25} color="grey" style={styles.icon} />
              <Text style={styles.pickerText}>{formattedTime || "hh:mm"}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={showPicker}
              mode="time"
              is24Hour
              date={date}
              display={Platform.OS === "android" ? "spinner" : undefined}
              onConfirm={handleDateChange}
              onCancel={() => setShowPicker(false)}
            />
          </View>
          {Platform.OS === "ios" ? (
            <SafeAreaView>
              <Text style={styles.label}>בחר/י ילד/ה</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setIsModalVisible(true)}
              >
                <Text styles={{ textAlign: "right" }}>
                  {selectedValue ? selectedValue : "בחר/י ילד"}
                </Text>
              </TouchableOpacity>
              <Modal
                animationType="slide"
                // transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                  setIsModalVisible(!isModalVisible);
                }}
              >
                <SafeAreaView style={styles.modalContainer}>
                  <FlatList
                    data={childList}
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
                  color="red"
                  width={200}
                  press={() => setIsModalVisible(!isModalVisible)}
                  style={{ marginBottom: 100 }}
                />
              </Modal>
            </SafeAreaView>
          ) : (
            <View style={styles.inputContainer}>
              <Picker
                style={styles.input}
                selectedValue={child}
                onValueChange={selectChild}
              >
                <Picker.Item label="בחר/י ילד" value="" />
                {childList.map((child) => (
                  <Picker.Item
                    key={child.id}
                    label={child.name}
                    value={child.id}
                  />
                ))}
              </Picker>
            </View>
          )}
        </ScrollView>
      )}
      <Buttons
        title="יצירת אוטובוס הליכה"
        color="#FFBF00"
        textColor="black"
        width={260}
        press={addWalkingGroupToDB}
        style={{ marginBottom: 100 }}
      />
    </SafeAreaView>
  );
};

// ------------------------Style area:------------------------
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#AED1EC",
  },
  modalContainer: {
    marginTop: "10%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#AED1EC",
  },
  optionContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
  },
  optionText: {
    fontSize: 40,
  },
  page: {
    backgroundColor: "#AED1EC",
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    backgroundColor: "#AED1EC",
    height: "100%",
    width: "110%",
    borderRadius: 20,
    alignSelf: "center",
    padding: 20,
  },
  inputContainer: {
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 5,
  },
  input: {
    flexDirection: "row",
    textAlign: "right",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    width: "90%",
    height: 35,
    paddingHorizontal: 10,
  },
  clock: {
    paddingTop: 2,
    fontSize: 20,
    textAlign: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    width: "20%",
    height: 35,
  },
  pickerText: {
    marginTop: 5,
    height: 35,
    width: "60%",
    paddingRight: 5,
    paddingLeft: 5,
    textAlign: "right",
  },
});

export default CreateWalkingGroup;
