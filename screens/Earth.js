import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Image,
  View,
  Text,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Animated,
} from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import { current, forecast, urban } from "../data/earthData";
import * as Font from "expo-font";
import Sun from "../assets/sun.png";
import { LinearGradient } from "expo-linear-gradient";
import Card from "../components/Card";
import { SearchBar, Icon } from "react-native-elements";
import Green from "../assets/green.png";
import axios from "axios";
import "react-native-gesture-handler";

export default function Earth() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [weather, setWeather] = useState(null);
  const [main, setMain] = useState(null);
  const [sys, setSys] = useState(null);
  const [list, setList] = useState(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [location, setLocation] = useState("hong kong");
  const [data, setData] = useState({ image: Green, name: "loading..." });
  const onChangeSearch = (query) => setSearchQuery(query);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const loadFonts = async () => {
    await Font.loadAsync({
      CanOne: require("../assets/CantoraOne.ttf"),
      Orbitron: require("../assets/Orbitron.ttf"),
    });
    setFontsLoaded(true);
  };
  const getData = (res) => {
    const data = res.data["_embedded"]["city:search-results"][0];
    const name = data["matching_full_name"];
    const imagelink = data["_links"]["city:item"]["href"];
    axios.get(imagelink).then((res) => {
      axios.get(res.data["_links"]["city:urban_area"]["href"]).then((res) => {
        axios.get(res.data["_links"]["ua:images"]["href"]).then((res) => {
          setData({
            image: { uri: res.data["photos"][0]["image"]["mobile"] },
            name,
          });
        });
      });
    });
  };
  useEffect(() => {
    try {
      current(location).then(({ data: { weather, main, sys } }) => {
        setWeather(weather);
        setMain(main);
        setSys(sys);
      });
      forecast(location).then(({ data: { list } }) => {
        setList(list);
      });
      urban(location).then((res) => {
        getData(res);
      });
    } catch (err) {
      setError(err);
    }

    loadFonts();
  }, [location]);
  const slide = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const slidebackwards = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });
  const unixtotime = (unix_timestamp) => {
    const date = new Date(unix_timestamp * 1000);
    const hours = date.getHours();
    const minutes = `${date.getMinutes()}`;
    return `${hours}:${
      10 > minutes.substring(-2)
        ? `0${minutes.substring(-2)}`
        : minutes.substring(-2)
    }`;
  };
  return (
    <ImageBackground
      source={data.image}
      resizeMode="cover"
      style={styles.container}
    >
      <SearchBar
        placeholder="Search a city..."
        onChangeText={onChangeSearch}
        value={searchQuery}
        containerStyle={{
          width: vw(80),
          height: vh(5),
          borderRadius: vw(5),
        }}
        round
        inputContainerStyle={{ height: vh(3), bottom: vh(0.4) }}
        lightTheme
        searchIcon={() => (
          <TouchableOpacity onPress={() => setLocation(searchQuery)}>
            <Icon
              name={"search"}
              type={"Feather"}
              style={{ width: 20, height: 20 }}
            ></Icon>
          </TouchableOpacity>
        )}
      />
      {!fontsLoaded || !main || !weather || !sys || !list || !location ? (
        <Text style={{ color: "red", bottom: 50 }}>{location}</Text>
      ) : (
        <>
          <Animated.View
            style={[
              styles.section,
              {
                height: vh(26),
                transform: [
                  {
                    translateX: slide,
                  },
                ],
                opacity: fadeAnim,
              },
            ]}
          >
            <View style={styles.firstleft}>
              <Image
                source={{
                  uri: `http://openweathermap.org/img/wn/${weather[0]?.icon}@2x.png`,
                }}
                style={{ width: vw(42), height: vh(12) }}
              ></Image>
              <Text
                style={{ fontFamily: "CanOne", color: "#FFF", fontSize: vw(9) }}
              >
                {main?.temp.toFixed(1)}˚C
              </Text>
              <Text style={{ fontFamily: "CanOne", color: "#FFF" }}>
                {weather[0]?.description}
              </Text>
            </View>
            <View style={styles.firstright}>
              <Text
                style={{
                  fontFamily: "Orbitron",
                  color: "#FFF",
                  fontSize: vw(5),
                }}
              >
                {unixtotime(sys?.sunrise)}
              </Text>
              <Image
                source={Sun}
                style={{ width: vw(14), height: vh(8) }}
              ></Image>
              <Text
                style={{
                  fontFamily: "Orbitron",
                  color: "#FFF",
                  fontSize: vw(5),
                }}
              >
                {unixtotime(sys?.sunset)}
              </Text>
              <View style={styles.templabel}>
                <Text
                  style={{
                    fontFamily: "CanOne",
                    color: "#FFF",
                    fontSize: vw(4.1),
                  }}
                >
                  {main?.temp_min.toFixed(1)}˚C
                </Text>
                <Text
                  style={{
                    fontFamily: "CanOne",
                    color: "#FFF",
                    fontSize: vw(4.1),
                  }}
                >
                  {main?.temp_max.toFixed(1)}˚C
                </Text>
              </View>
              <LinearGradient
                colors={["#00A3FF", "#FF4B4B"]}
                style={styles.gradient}
              ></LinearGradient>
            </View>
          </Animated.View>
          <Animated.View
            style={[
              styles.section,
              {
                paddingHorizontal: vw(5),
                paddingVertical: vh(1),
                height: vh(50),
                transform: [
                  {
                    translateX: slidebackwards,
                  },
                ],
                opacity: fadeAnim,
              },
            ]}
          >
            <FlatList
              data={list}
              renderItem={({ item }) => {
                return (
                  <Card
                    image={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                    date={item.dt_txt.split(" ")[0]}
                    description={item.weather[0].description}
                    temp={item.main.temp.toFixed(1)}
                    time={item.dt_txt.split(" ")[1]}
                    more={{
                      feelsLike: item.main["feels_like"],
                      humidity: item.main.humidity,
                      pressure: item.main.pressure,
                    }}
                  ></Card>
                );
              }}
              keyExtractor={(_, index) => `${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
            ></FlatList>
          </Animated.View>
        </>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#899D5E",
  },
  section: {
    backgroundColor: "#54738E",
    width: vw(90),
    borderRadius: vh(5),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  firstleft: {
    height: "90%",
    width: "40%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 5,
  },
  firstright: {
    height: "90%",
    width: "40%",
    flexDirection: "column",
    alignItems: "center",
    padding: 5,
  },
  templabel: {
    width: "100%",
    flexDirection: "row",
    paddingVertical: vh(2),
    justifyContent: "space-between",
  },
  gradient: {
    height: vw(27),
    width: vh(1),
    transform: [{ rotate: "270deg" }],
    bottom: 58,
    borderRadius: vw(1.2),
  },
  image: {
    width: vw(40),
    height: vh(20),
    flex: 1,
    alignSelf: "center",
  },
});
