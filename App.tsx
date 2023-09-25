import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { WeatherData, WeatherForecast } from "./interfaces";
import { apiKey } from "./secrets";
import * as Location from "expo-location";

const monthNumbers = {
  "01": "Jan",
  "02": "Feb",
  "03": "Mar",
  "04": "Apr",
  "05": "May",
  "06": "Jun",
  "07": "Jul",
  "08": "Aug",
  "09": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dec",
};

const apiUrl = "http://api.weatherapi.com/v1";
export default function App() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{
    latitude: Number;
    longitude: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  useEffect(() => {
    try {
      const getLocationFromDevice = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        let address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setCoordinates({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        if (address.length > 0) {
          let city = address[0].city;
          setCity(city);
        }
      };
      getLocationFromDevice();
      const getCurrentWeatherFromApi = async () => {
        if (!coordinates) {
          return;
        }
        const response = await axios.get(
          `${apiUrl}/current.json?key=${apiKey}&q=${coordinates.latitude},${coordinates.longitude}`
        );
        const answerFromApi = response.data;
        setCurrentWeather(answerFromApi);
      };
      getCurrentWeatherFromApi();
      const getWeatherForecastFromApi = async () => {
        if (!coordinates) {
          return;
        }
        const response = await axios.get(
          `${apiUrl}/forecast.json?key=${apiKey}&q=${coordinates.latitude},${coordinates.longitude}&days=14`
        );
        const answerFromApi = response.data;
        setForecast(answerFromApi);
      };
      getWeatherForecastFromApi();
    } catch (error) {
      console.log(error);
    }
  }, [coordinates]);
  if (!currentWeather) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }
  if (!forecast) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }
  if (!city || !coordinates) {
    return <Text style={styles.loadingText}>{errorMsg}</Text>;
  }

  return (
    <SafeAreaView>
      <View style={[styles.container]}>
        <Text style={styles.textAlignCenter}>{city}</Text>
        <View style={[styles.currentWeatherContainer]}>
          <Image
            source={{ uri: `http:${currentWeather.current.condition.icon}` }}
            style={styles.heroWeatherIcon}
          />
          <Text style={styles.heroTemperature}>
            {currentWeather.current.temp_c > 0 ? `+` : `-`}
            {currentWeather.current.temp_c}°C
          </Text>
        </View>
        <Text style={[styles.textAlignCenter, styles.bold]}>
          Humidity: {currentWeather.current.humidity}%
        </Text>
        <StatusBar style="auto" />
      </View>
      <ScrollView horizontal style={styles.horizontalHourForecast}>
        {forecast.forecast.forecastday[0].hour.map((anHour) => {
          return (
            <View style={styles.hourForecastContainer} key={anHour.time}>
              <Text>{anHour.time.split(" ")[1]}</Text>
              <Image
                style={styles.hourWeatherIcon}
                source={{ uri: `http:${anHour.condition.icon}` }}
              />
              <Text>
                {anHour.temp_c > 0 ? `+` : `-`}
                {anHour.temp_c}°
              </Text>
            </View>
          );
        })}
      </ScrollView>
      <Text
        style={[styles.textAlignCenter, styles.forecastHeader, styles.bold]}
      >
        Forecast for the next 14 days
      </Text>
      <View style={styles.forecastGridContainer}>
        <FlatList
          style={styles.flatListForecast}
          numColumns={3}
          keyExtractor={(aDay) => aDay.date}
          data={forecast.forecast.forecastday}
          renderItem={({ item: aDay }) => (
            <View style={styles.forecastContainer}>
              <Text style={styles.forecastDate}>
                {
                  monthNumbers[
                    aDay.date.split("-")[1] as keyof typeof monthNumbers
                  ]
                }{" "}
                {aDay.date.split("-")[2]}
              </Text>
              <Image
                source={{
                  uri: `http:${aDay.day.condition.icon}`,
                }}
                style={styles.weathericon}
              />
              <View>
                <Text style={styles.minMaxTemp}>
                  Min: {aDay.day.mintemp_c}°
                </Text>
                <Text style={styles.minMaxTemp}>
                  Max: {aDay.day.maxtemp_c}°
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginTop: 40,
  },
  bold: {
    fontWeight: "500",
  },
  size: {
    fontSize: 18,
  },
  weathericon: {
    width: 45,
    height: 45,
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
  },
  currentWeatherContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  forecastContainer: {
    marginHorizontal: 25,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  flatListForecast: {
    height: "55%",
  },
  textAlignCenter: {
    textAlign: "center",
  },
  forecastHeader: {
    marginTop: 15,
    fontSize: 16,
    borderColor: "#d9dbdb",
    borderWidth: 1,
    paddingVertical: 5,
    borderRadius: 5,
  },
  horizontalHourForecast: {
    height: "10%",
    marginHorizontal: 20,
    marginBottom: 15,
    marginTop: 25,
  },
  hourWeatherIcon: {
    width: 30,
    height: 30,
    marginVertical: 3,
  },
  hourForecastContainer: {
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  heroWeatherIcon: {
    width: 90,
    height: 90,
    marginLeft: -17,
  },
  heroTemperature: {
    fontSize: 36,
    fontWeight: "600",
    textAlign: "left",
  },
  forecastGridContainer: {
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  minMaxTemp: {
    fontSize: 12,
    marginTop: 3,
  },
  forecastDate: {
    fontWeight: "500",
  },
  loadingText: {
    marginTop: 50,
    marginLeft: 50,
  },
});
