import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TextInput,
} from "react-native";
import { vw } from "react-native-expo-viewport-units";
import "react-native-gesture-handler";
import animation from "../assets/animation.gif";
import { useFonts } from "expo-font";
import { current, forecast, urban } from "../data/earthData";
import "react-native-gesture-handler";
import Green from "../assets/green.png";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";

export default function CitySearch({ navigation }) {
  const [weather, setWeather] = useState(null);
  const [main, setMain] = useState(null);
  const [list, setList] = useState(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [location, setLocation] = useState("");
  const [data, setData] = useState({ image: Green, name: "loading..." });
  const [error, setError] = useState(null);
  const [sys, setSys] = useState(null);
  const onChangeSearch = (query) => setSearchQuery(query);
  const [loaded] = useFonts({
    VarelaRound: require("../assets/VarelaRound-Regular.ttf"),
  });
  const { promiseInProgress } = usePromiseTracker();
  useEffect(() => {
    if (
      weather !== null &&
      data !== { image: Green, name: "loading..." } &&
      list !== null
    ) {
      navigation.navigate("Data", {
        weather,
        main,
        list,
        data,
        promiseInProgress,
        sys,
      });
    }
  }, [weather, data, list]);
  const getData = (res) => {
    const data = res.data;
    const photoReference = data.candidates[0].photos[0]["photo_reference"];
    const name = data.candidates[0].name;
    const link = `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoReference}&key=AIzaSyDsglUyv93_Gc5QfjX00r7drRMNLX6vFdQ&maxwidth=400&maxheight=400`;
    setData({
      image: { uri: link },
      name,
    });
  };
  useEffect(() => {
    try {
      trackPromise(
        current(location).then(({ data: { weather, main, sys } }) => {
          setWeather(weather);
          setMain(main);
          setSys(sys);
        }),

        forecast(location).then(({ data: { list } }) => {
          setList(list);
        }),
        urban(location)
          .then((res) => {
            getData(res);
          })
          .catch((err) => {
            console.log(err);
          }),
      );
    } catch (err) {
      setError(err);
    }
  }, [location]);

  if (!loaded) {
    return null;
  }
  return (
    <ImageBackground style={styles.container} source={animation}>
      <Text style={styles.hello}>Hello!</Text>

      <TextInput
        style={styles.input}
        onChangeText={onChangeSearch}
        value={searchQuery}
        placeholder="Type the name of a city..."
        returnKeyType="go"
        onSubmitEditing={() => {
          setLocation(searchQuery);
        }}
      />
      {error ? <Text>{error}</Text> : null}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  hello: {
    color: "#00ACD1",
    fontSize: vw(20),
    fontFamily: "VarelaRound",
  },
  input: {
    borderWidth: 1,
    width: vw(77.78),
    height: vw(11.35),
    borderRadius: vw(77.78),
    paddingHorizontal: vw(5),
    backgroundColor: "#FFF",
    fontSize: vw(4),
  },
});
