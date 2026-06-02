import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import LocationSelector from "../../components/LocationSelector";

export default function App() {
  const [selectedCity, setSelectedCity] = useState("");

  // Main screen after splash
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check the Weather Today</Text>
      <LocationSelector />

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex:1,
    margin:5,
    marginTop:30,
    backgroundColor: "#cbbdd7",
  },

  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#11049f",
    margin: 20,
    textAlign: "center",
  },
  });