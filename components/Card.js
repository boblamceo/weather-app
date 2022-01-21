import React, { useEffect, useState } from "react";
import { View, Image, Text } from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import * as Font from "expo-font";

const Card = ({ image, temp, description, date, time, more }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      CanOne: require("../assets/CantoraOne.ttf"),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);
  if (!fontsLoaded) {
    return <Text>loading...</Text>;
  }
  return (
    <View
      style={{
        height: vh(40),
        width: vw(50),
        backgroundColor: "#899D5E",
        marginHorizontal: vw(1),
        borderRadius: vw(2),
        padding: 10,
      }}
    >
      <Text style={{ color: "white", fontFamily: "CanOne", fontSize: vw(2.5) }}>
        {date} {`${time.split(":")[0]}:${time.split(":")[1]}`}
      </Text>
      <Image
        source={{ uri: image }}
        style={{ height: vh(23), width: vw(43), bottom: vh(3) }}
      />
      <View
        style={{
          bottom: vh(7),
          paddingVertical: vh(1),
        }}
      >
        <Text
          style={{
            fontFamily: "CanOne",
            color: "white",
            fontSize: vw(10),
            alignSelf: "center",
          }}
        >
          {temp}˚C
        </Text>
        <Text
          style={{
            fontFamily: "CanOne",
            color: "white",
            fontSize: vw(4),
            alignSelf: "center",
          }}
        >
          {description}
        </Text>
        <View style={{ alignSelf: "center", alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "CanOne",
              color: "white",
              fontSize: vw(4),
            }}
          >
            Feels like {more.feelsLike.toFixed(1)}˚C
          </Text>
          <Text
            style={{
              fontFamily: "CanOne",
              color: "white",
              fontSize: vw(4),
            }}
          >
            humidity: {more.humidity}%
          </Text>
          <Text
            style={{
              fontFamily: "CanOne",
              color: "white",
              fontSize: vw(4),
            }}
          >
            pressure: {more.pressure} hPa.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Card;
