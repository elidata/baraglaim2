import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Pressable, Text, TouchableOpacity, Button, ImageBackground, SafeAreaView } from 'react-native';


function Buttons(props) {
  const textcolor = props.textColor ? props.textColor : '#fff';
  return (
    <TouchableOpacity style={[styles.buttonStyle, props.style, { backgroundColor: props.color, width: props.width }]} onPress={props.press}>
      <Text style={[styles.buttonText,{color:textcolor}]}>{props.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    borderRadius: 130,
    padding: 2,
    marginBottom: 30,
    marginTop: 10,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Buttons;