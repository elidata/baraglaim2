import React from "react";
import { Text, View, StyleSheet, FlatList, Dimensions } from "react-native";

const windowDimensions = Dimensions.get("window")

function ListContainer(props) {
  let arg = props.data;
  let objArray = [];

  for (let i = 0; i < arg.length; i++) {
    objArray.push({ id: i, title: arg[i] });
  }


 const [dimensions, setDimensions] = useState({
    windowDimensions
 });

 useEffect(() => {
   const subscription = Dimensions.addEventListener(
     'change',
     ({window}) => {
       setDimensions({window});
     },
   );
   return () => subscription?.remove();
 })

  // const containerHeight = windowDimensions.height * props.height;
  // const containerWidth = windowDimensions.width * props.width;

  const renderSeparator = () => {
    return <View style={[styles.separator , {backgroundColor: props.separatorColor}]} />;
  };

  return (
    <View style={[styles.container, props.style, { height: windowDimensions.height * props.height ,width: windowDimensions.width * props.width}]}>
      <View style={[styles.list, { backgroundColor: props.backgroundColor}]}>
        <FlatList
          data={objArray}
          keyExtractor={(item,index) => index.toString()}
          renderItem={({ item }) => (
            <View>
              <Text style={{ padding: 10 }}>{item.title}</Text>
              {renderSeparator()}
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  separator: {
    height: 1,
    marginHorizontal: 10,
  },
});

export default ListContainer;
