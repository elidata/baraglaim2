import { StyleSheet } from "react-native";

export const MainStyles = StyleSheet.create({
  page: {
    flex: 1,
    marginTop: 30,
    backgroundColor: "#AED1EC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 5,
  }
});

export const Writings = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
});


export const Inputs = StyleSheet.create({
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
  inputContainer: {
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
  },
});