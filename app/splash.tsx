import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, Image, StyleSheet, View } from "react-native";

export default function Splash() {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    // Zoom-in animation for "WeatherCheck"
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();

    // Simulate loading (3 seconds), then navigate into tabs
    const timer = setTimeout(() => {
      router.replace("/(tabs)"); // 👈 go to tab bar after splash
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require("@/assets/images/weather.png")} style={styles.logo} />
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
