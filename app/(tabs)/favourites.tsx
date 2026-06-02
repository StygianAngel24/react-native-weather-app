import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// TypeScript type for weather data
type WeatherItem = {
  location: {
    name: string;
    country: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
    };
  };
};

export default function Favourites() {
  const [favourites, setFavourites] = useState<WeatherItem[]>([]);

  // Reload favourites every time this page is visited
  useFocusEffect(
    useCallback(() => {
      loadFavourites();
    }, [])
  );

  const loadFavourites = async () => {
    try {
      const existing = await AsyncStorage.getItem("favourites");
      const data: WeatherItem[] = existing ? JSON.parse(existing) : [];
      setFavourites(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Remove a favourite
  const handleRemove = (locationName: string) => {
    Alert.alert(
      "Remove Favourite",
      `Remove ${locationName} from favourites?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            const updated = favourites.filter(
              (item) => item.location.name !== locationName
            );
            setFavourites(updated);
            await AsyncStorage.setItem("favourites", JSON.stringify(updated));
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Favourite Weather</Text>

      {favourites.length === 0 ? (
        <Text style={styles.emptyText}>No favourites yet. Like a weather result to save it here!</Text>
      ) : (
        favourites.map((item, index) => (
          <View key={index} style={styles.card}>
            {/* Remove Button */}
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemove(item.location.name)}
            >
              <Text style={styles.removeButtonText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.cardTitle}>
              🌤 {item.location.name}, {item.location.country}
            </Text>
            <Text style={styles.cardText}>Temperature: {item.current.temp_c}°C</Text>
            <Text style={styles.cardText}>Condition: {item.current.condition.text}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
    marginTop: 30,
    backgroundColor: "#dcd1e4",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#11049f",
    margin: 20,
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 40,
    fontSize: 14,
    paddingHorizontal: 30,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  removeButton: {
    alignSelf: "flex-end",
    backgroundColor: "#e74c3c",
    borderRadius: 20,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  removeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
});