import React, { useEffect, useState } from "react";
import { StyleSheet, Image, View, Text } from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import { func } from "../data/earthData";
import * as Font from "expo-font";
import Sun from "../assets/sun.png";
import { LinearGradient } from "expo-linear-gradient";
import { weatherConditions } from "../data/weatherConditions";

export default function Earth() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [weather, setWeather] = useState(null);
  const [main, setMain] = useState(null);
  const [sys, setSys] = useState(null);
  const loadFonts = async () => {
    await Font.loadAsync({
      CanOne: require("../assets/CantoraOne.ttf"),
      Orbitron: require("../assets/Orbitron.ttf"),
    });
    setFontsLoaded(true);
  };
  useEffect(() => {
    func().then(({ data: { weather, main, sys } }) => {
      console.log("yeet");
      setWeather(weather);
      setMain(main);
      setSys(sys);
    });
    loadFonts();
  }, []);
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
  if (!fontsLoaded || !main || !weather) {
    return <Text>loading...</Text>;
  }
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: weatherConditions[weather[0]?.main].color },
      ]}
    >
      <View style={styles.section}>
        <View style={styles.firstleft}>
          <Image
            source={{
              uri: `http://openweathermap.org/img/wn/${weather[0]?.icon}@2x.png`,
            }}
            style={{ width: vw(40), height: vh(10) }}
          ></Image>
          <Text
            style={{ fontFamily: "CanOne", color: "#FFF", fontSize: vw(8) }}
          >
            {main?.temp.toFixed(1)}˚C
          </Text>
          <Text style={{ fontFamily: "CanOne", color: "#FFF" }}>
            {weather[0]?.description}
          </Text>
        </View>
        <View style={styles.firstright}>
          <Text
            style={{ fontFamily: "Orbitron", color: "#FFF", fontSize: vw(5) }}
          >
            {unixtotime(sys?.sunrise)}
          </Text>
          <Image source={Sun} style={{ width: vw(14), height: vh(8) }}></Image>
          <Text
            style={{ fontFamily: "Orbitron", color: "#FFF", fontSize: vw(5) }}
          >
            {unixtotime(sys?.sunset)}
          </Text>
          <View style={styles.templabel}>
            <Text
              style={{ fontFamily: "CanOne", color: "#FFF", fontSize: vw(4.1) }}
            >
              {main?.temp_min.toFixed(1)}˚C
            </Text>
            <Text
              style={{ fontFamily: "CanOne", color: "#FFF", fontSize: vw(4.1) }}
            >
              {main?.temp_max.toFixed(1)}˚C
            </Text>
          </View>
          <LinearGradient
            colors={["#00A3FF", "#FF4B4B"]}
            style={styles.gradient}
          ></LinearGradient>
        </View>
      </View>
      <View style={styles.section}></View>
      <View style={styles.section}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    backgroundColor: "#54738E",
    height: vh(23),
    width: vw(90),
    marginVertical: vh(3),
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
    padding: 5,
    justifyContent: "space-between",
  },
  gradient: {
    height: vw(27),
    width: vh(1),
    transform: [{ rotate: "270deg" }],
    bottom: 50,
    borderRadius: vw(1.2),
  },
});
