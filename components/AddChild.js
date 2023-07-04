// ----------------------- Import packages and files --------------------- //
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  FlatList,
} from "react-native";
import { db, auth } from "../FireBaseConsts";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import Buttons from "./Buttons";
import HeaderIcons from "./HeaderIcons";
import { Picker } from "@react-native-picker/picker";

const AddChild = ({ navigation }) => {
  // ------------------------Back-End area:------------------------
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [classChild, setClassChild] = useState("");
  const [school, setSchool] = useState("");
  const [schoolList, setSchoolList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [isClassModalVisible, setIsClassModalVisible] = useState(false);
  const [selectedClassValue, setSelectedClassValue] = useState("");

  /**
   * Fetches the schools from the database and updates the school list
   * @returns {<void>}
   */
  useEffect(() => {
    fetchSchools();
  }, []);

  /**
   * Fetches the schools from the database and updates the school list
   * @returns {<void>}
   */
  async function fetchSchools() {
    try {
      setIsLoading(true);
      const schoolsCollection = collection(db, "School");
      const schoolsSnapshot = await getDocs(schoolsCollection);
      const schoolsData = schoolsSnapshot.docs.map((doc) => {
        return { id: doc.id, name: doc.data().name };
      });
      setIsLoading(false);
      setSchoolList(schoolsData);
    } catch (error) {
      console.log("Error fetching school data:", error);
      setIsLoading(false);
    }
  }

  /**
   * Fetches the classes for the selected school from the database and updates the class list
   * @param {string} schoolID - The id of the selected school
   * @returns {<void>}
   */
  async function fetchClasses(schoolID) {
    setIsLoadingClasses(true);
    try {
      const schoolDocRef = doc(db, "School", schoolID);
      const classesCollection = collection(schoolDocRef, "Classes");
      const classesSnapshot = await getDocs(classesCollection);
      const classesData = classesSnapshot.docs.map((doc) => {
        return { id: doc.id, name: doc.data().name }; // Include the id property
      });
      console.log(classesData);
      setClassList(classesData);
      setIsLoadingClasses(false);
    } catch (error) {
      console.log("Error fetching classes data:", error);
      setIsLoadingClasses(false);
    }
  }

  /**
   * Adds the child to the database and updates the user's children list
   * @returns {<void>}
   */
  async function addChildToDB() {
    setIsLoading(true);
    if (!name) {
      Alert.alert("שגיאה", "יש להזין שם", [
        { text: "הבנתי", onPress: () => setName("") },
      ]);
      setIsLoading(false);
      return;
    }
    if (school === "") {
      Alert.alert("שגיאה", "יש לבחור בית ספר", [
        { text: "הבנתי", onPress: () => setSchool("") },
      ]);
      setIsLoading(false);
      return;
    }
    if (classChild === "") {
      Alert.alert("שגיאה", "יש לבחור כיתה", [
        { text: "הבנתי", onPress: () => setClassChild("") },
      ]);
      setIsLoading(false);
      return;
    }
    if (gender === "") {
      Alert.alert("שגיאה", "יש לבחור מין", [
        { text: "הבנתי", onPress: () => setGender("") },
      ]);
      setIsLoading(false);
      return;
    }
    if (phone && phone.length !== 10) {
      Alert.alert("שגיאה", "מספר הטלפון חייב להיות בעל 10 ספרות", [
        { text: "הבנתי", onPress: () => setPhone("") },
      ]);
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
    const childDocRef = await addDoc(collection(db, "Children"), {
      name: name,
      school: school,
      class: classChild,
      gender: gender,
      phone: phone,
      parent: userDocId,
    });
    let newChildId = childDocRef.id;
    if (userDocRef.data().children) {
      updateDoc(doc(db, `Users/${userDocId}`), {
        children: [...userDocRef.data().children, newChildId],
      });
    } else {
      updateDoc(doc(db, `Users/${userDocId}`), {
        children: [newChildId],
      });
    }
    setIsLoading(false);
    Alert.alert("ברכות", "הילד/ה נוסף/ה בהצלחה", [{ text: "אישור" }]);
    navigation.navigate("WatchMyChilds", {
      username: userDocRef.data().username,
    });
  }

  //-----------------------------functions area:-----------------------------//

  /**
   * Selects the school from the school picker
   * @param {string} itemValue - The id of the selected school
   * @returns {<void>}
   */
  function selectSchool(itemValue) {
    setSchool(itemValue);
    fetchClasses(itemValue);
  }

  /**
   * Selects the class from the class picker
   * @param {string} itemValue - The id of the selected class
   * @returns {<void>}
   */
  const selectClass = (itemValue) => {
    setClassChild(itemValue);
  };
  const selectOption = (item) => {
    setSelectedValue(item.name);
    selectSchool(item.id);
    setIsModalVisible(false);
  };

  const selectClassOption = (item) => {
    setSelectedClassValue(item.name);
    selectClass(item.id);
    setIsClassModalVisible(false);
  };

  return (
    // ------------------------Front-End area:------------------------
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.header}>טוען נתונים...</Text>
          <ActivityIndicator size="large" color="#4682B4" />
        </View>
      ) : (
          <View style={styles.overlay}>
        <ScrollView style={styles.formContainer}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>הוספת ילד/ה</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>שם הילד/ה:</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="שם הילד/ה"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>מספר הטלפון של הילד/ה:</Text>
              <TextInput
                style={styles.input}
                value={phone}
                maxLength={10}    
                onChangeText={setPhone}
                placeholder="מספר הטלפון של הילד/ה, במידה ויש נייד"
                keyboardType="numeric"
              />
            </View>
            <View sctyle={styles.inputContainer}>
              <Text style={styles.label}>בית ספר:</Text>
              {Platform.OS === "ios" ? (
                  <View style={[styles.inputPickerContainer, { justifyContent: "center" }]}>

                  <TouchableOpacity
                    style={[styles.input, styles.inputRight]}
                    onPress={() => setIsModalVisible(true)}
                  >
                    <Text style={{ textAlign: "right", width: "100%" }}>
                      {selectedValue ? selectedValue : "בחר בית ספר"}
                    </Text>
                  </TouchableOpacity>
                  <Modal
                    visible={isModalVisible}
                    animationType="slide"
                    style={styles.modal}
                  >
                    <SafeAreaView style={styles.modalContainer}>
                      <FlatList
                        data={schoolList}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={styles.optionContainer}
                            onPress={() => selectOption(item)}
                          >
                            <Text style={styles.optionText}>{item.name}</Text>
                          </TouchableOpacity>
                        )}
                      />
                        <Buttons
                        style = {{marginBottom: 100}}
                        title="סגור"
                        color="red"
                        width={200}
                        press={() => setIsModalVisible(false)}
                      />
                    </SafeAreaView>
                  </Modal>
                </View>
              ) : (
                <View style={styles.inputContainer}>
                  <Picker
                    style={styles.input}
                    selectedValue={school}
                    onValueChange={selectSchool}
                  >
                    <Picker.Item label="בחר בית ספר" value="" />
                    {schoolList.map((school) => (
                      <Picker.Item
                        key={school.id}
                        label={school.name}
                        value={school.id}
                      />
                    ))}
                  </Picker>
                </View>
              )}
            </View>
            {Platform.OS === "ios" ? (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>כיתה:</Text>
                {isLoadingClasses ? (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.header}>טוען כיתות...</Text>
                    <ActivityIndicator size="large" color="#4682B4" />
                  </View>
                ) : (
                  <View style={styles.inputPickerContainer}>
                    <TouchableOpacity
                      style={styles.input}
                      onPress={() => setIsClassModalVisible(true)}
                    >
                      <Text styles={{ textAlign: "right" }}>
                        {selectedClassValue ? selectedClassValue : "בחר כיתה"}
                      </Text>
                    </TouchableOpacity>
                    <Modal
                      visible={isClassModalVisible}
                      animationType="slide"
                      style={styles.modal}
                    >
                      <SafeAreaView style={styles.modalContainer}>
                        <FlatList
                          data={classList}
                          keyExtractor={(item) => item.id}
                          renderItem={({ item }) => (
                            <TouchableOpacity
                              style={styles.optionContainer}
                              onPress={() => selectClassOption(item)}
                            >
                              <Text style={styles.optionText}>{item.name}</Text>
                            </TouchableOpacity>
                          )}
                        />
                          <Buttons
                          style = {{marginBottom: 100}}
                          title="סגור"
                          color="red"
                          width={200}
                          press={() => setIsClassModalVisible(false)}
                        />
                      </SafeAreaView>
                    </Modal>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>כיתה:</Text>
                {isLoadingClasses ? (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.header}>טוען כיתות...</Text>
                    <ActivityIndicator size="large" color="#4682B4" />
                  </View>
                ) : (
                  <View style={styles.inputContainer}>
                    <Picker
                      style={styles.input}
                      selectedValue={classChild}
                      onValueChange={selectClass}
                    >
                      <Picker.Item label="בחר כיתה" value="" />
                      {classList.map((classItem) => (
                        <Picker.Item
                          key={classItem.id}
                          label={classItem.name}
                          value={classItem.id}
                        />
                      ))}
                    </Picker>
                  </View>
                )}
              </View>
            )}
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "male" ? styles.selectedGenderButton : null,
                ]}
                onPress={() => setGender("male")}
              >
                <Text style={styles.genderLabel}>👦</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "female" ? styles.selectedGenderButton : null,
                ]}
                onPress={() => setGender("female")}
              >
                <Text style={styles.genderLabel}>👧</Text>
              </TouchableOpacity>
            </View>
          </View>
            </ScrollView>
        </View>
      )}
      <Buttons
        title="הוסף ילד/ה"
        color="#FFBF00"
        textColor="black"
        // width={200}
        press={addChildToDB}
        width={160}
        style={{ marginBottom: 100 }}     
      />
      <HeaderIcons navigation={navigation} />
    </SafeAreaView>
  );
};

// -----------------------------styles area:-----------------------------//
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#AED1EC",
  },
  modal: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#AED1EC",
  },
  modalContainer: {
    marginTop: 50,
    height: "100%",
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
  formContainer: {
    backgroundColor: "#AED1EC",
    marginBottom: 20,
    height: "80%",
    width: "90%",
    borderRadius: 20,
    alignSelf: "center",
  },
  container: {
    backgroundColor: "#AED1EC",
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    marginTop: 50,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
    marginBottom: 5,
    marginTop: 20,
  },
  inputContainer: {
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  inputPickerContainer: {
    width: "100%",
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
    textAlign: "right",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    width: "100%",
    height: 35,
    paddingHorizontal: 10,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 10,
  },
  genderButton: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    padding: 10,
    width: "45%",
    alignItems: "center",
  },
  selectedGenderButton: {
    backgroundColor: "#839BE8",
  },
  genderLabel: {
    fontSize: 20,
  },
  overlay: {
    backgroundColor: "#AED1EC",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputRight: {
    alignSelf: "right",
    textAlign: "right",
    backgroundColor: "white",
    direction: "rtl",
  },
});

export default AddChild;
