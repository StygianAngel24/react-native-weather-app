import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { fetchWeather } from "./WeatherService";

export default function LocationSelector() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [weather, setWeather] = useState(null);
  const [liked, setLiked] = useState(false);

  const API_KEY =
    "89f71d97067bf2ce2b96c41e9a52c58525c25de2c7ab7ebd85b311cba42e35a0";
  const BASE_URL = "https://api.countrystatecity.in/v1";

  const headers = {
    "X-CSCAPI-KEY": API_KEY,
  };

  // Reset liked when weather changes
  useEffect(() => {
    setLiked(false);
  }, [weather]);

  // Clear all selections
  const handleClear = () => {
    setSelectedCountry("");
    setSelectedState("");
    setSelectedCity("");
    setStates([]);
    setCities([]);
    setWeather(null);
    setLiked(false);
  };

  // Load countries
  useEffect(() => {
    fetch(`${BASE_URL}/countries`, { headers })
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch((err) => console.error(err));
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      fetch(`${BASE_URL}/countries/${selectedCountry}/states`, { headers })
        .then((res) => res.json())
        .then((data) => setStates(data))
        .catch((err) => console.error(err));
    }
  }, [selectedCountry]);

  // Load cities when state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      fetch(
        `${BASE_URL}/countries/${selectedCountry}/states/${selectedState}/cities`,
        { headers }
      )
        .then((res) => res.json())
        .then((data) => setCities(data))
        .catch((err) => console.error(err));
    }
  }, [selectedState]);

  // Handle Enter button
  const handleEnter = async () => {
    const location = selectedCity || selectedState || selectedCountry;

    if (!location) {
      Alert.alert("No Location", "Please select at least a country.");
      return;
    }

    const locationName =
      selectedCity ||
      states.find((s) => s.iso2 === selectedState)?.name ||
      countries.find((c) => c.iso2 === selectedCountry)?.name ||
      location;

    try {
      const data = await fetchWeather(locationName);

      if (!data || !data.current) {
        Alert.alert(
          "Weather Unavailable",
          `Weather cannot be displayed for ${locationName}`,
          [{ text: "OK", onPress: handleClear }]
        );
      } else {
        setWeather(data);
      }
    } catch {
      Alert.alert(
        "Weather Unavailable",
        `Weather cannot be displayed for ${locationName}`,
        [{ text: "OK", onPress: handleClear }]
      );
    }
  };

  // Handle Like button — save to AsyncStorage
  const handleLike = async () => {
    if (!weather) return;

    try {
      const existing = await AsyncStorage.getItem("favourites");
      const favourites = existing ? JSON.parse(existing) : [];

      // Check if already saved
      const alreadyExists = favourites.some(
        (item) => item.location.name === weather.location.name
      );

      if (alreadyExists) {
        Alert.alert("Already Saved", `${weather.location.name} is already in your favourites.`);
        return;
      }

      const updated = [...favourites, weather];
      await AsyncStorage.setItem("favourites", JSON.stringify(updated));
      setLiked(true);
      Alert.alert("Saved!", `${weather.location.name} added to favourites. ❤️`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View>
      {/* Select Location Card */}
      <View style={styles.container}>
        <Text style={styles.title}>Select Location</Text>

        {/* Country Dropdown */}
        <Picker
          selectedValue={selectedCountry}
          onValueChange={(val) => setSelectedCountry(val)}
        >
          <Picker.Item label="Select Country" value="" />
          {countries.map((c) => (
            <Picker.Item key={c.iso2} label={c.name} value={c.iso2} />
          ))}
        </Picker>

        {/* State Dropdown */}
        <Picker
          enabled={!!selectedCountry}
          selectedValue={selectedState}
          onValueChange={(val) => setSelectedState(val)}
        >
          <Picker.Item label="Select State" value="" />
          {states.map((s) => (
            <Picker.Item key={s.iso2} label={s.name} value={s.iso2} />
          ))}
        </Picker>

        {/* City Dropdown */}
        <Picker
          enabled={!!selectedState}
          selectedValue={selectedCity}
          onValueChange={(val) => setSelectedCity(val)}
        >
          <Picker.Item label="Select City" value="" />
          {cities.map((city) => (
            <Picker.Item key={city.id} label={city.name} value={city.name} />
          ))}
        </Picker>

        {/* Enter Button */}
        <TouchableOpacity style={styles.enterButton} onPress={handleEnter}>
          <Text style={styles.enterButtonText}>Enter</Text>
        </TouchableOpacity>

        {/* Clear Button */}
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Weather Output Card */}
      {weather && (
        <View style={styles.weatherBox}>
          {/* Like Button */}
          <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
            <Text style={styles.likeButtonText}>
              {liked ? "❤️ Liked" : "🤍 Like"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.weatherTitle}>Weather Info</Text>
          <Text>🌤 {weather.location.name}, {weather.location.country}</Text>
          <Text>Temperature: {weather.current.temp_c}°C</Text>
          <Text>Condition: {weather.current.condition.text}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    margin: 16,
    elevation: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  enterButton: {
    backgroundColor: "#1ea81c",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  enterButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  clearButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  clearButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  weatherBox: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 10,
    elevation: 20,
  },
  weatherTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  likeButton: {
    alignSelf: "flex-end",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#f0e6ff",
    marginBottom: 8,
  },
  likeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7b2ff7",
  },
});