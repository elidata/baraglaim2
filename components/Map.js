import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Constants from 'expo-constants';

export default function Map() {
  return (
    <Text>Maps Here</Text>
  )
}
/*export default function Map() {

  const [initialPosition, setInitialPosition] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    (async () => {
      if (Constants.platform.ios) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setInitialPosition({
        latitude,
        longitude,
        // latitudeDelta: 0.0922,
        // longitudeDelta: 0.0421,
        // latitude: 31.767885,
        // longitude: 35.193521,
        latitudeDelta: 0.007, // Adjust this value to change the zoom level
        longitudeDelta: 0.007, // Adjust this value to change the zoom level
      });
      setMarkers([{ latitude, longitude }]);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {initialPosition && (
        <MapView style={styles.map} initialRegion={initialPosition}>
          {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker}
              title="You are here"
              description="Your current location"
            />
          ))}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
*/
