import { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, Image, StyleSheet, View } from "react-native";

export default function Splash({ onFinish }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Zoom-in animation for "WeatherCheck"
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();

    // Simulate loading (3 seconds)
    const timer = setTimeout(() => {
      onFinish(); // move to main screen
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/weather.png')} style={styles.logo} />
      <Animated.Text style={[styles.title, { transform: [{ scale: scaleAnim }] }]}>
        WeatherCheck
      </Animated.Text>
      <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "white" 
},
  logo: { 
    width: 150, 
    height: 150, 
    marginBottom: 20
 },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#11049f" 
},
});
