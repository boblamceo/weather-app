import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ImageBackground,
} from "react-native";
import { Header } from "react-native-elements";
import { vh, vw } from "react-native-expo-viewport-units";
import { useFonts } from "expo-font";
import { Picker } from "@react-native-picker/picker";
import { LineChart } from "react-native-chart-kit";
import { Rect, Text as TextSVG, Svg } from "react-native-svg";
import {
  Colors,
  IconButton,
  Dialog,
  Portal,
  ToggleButton,
  Provider,
} from "react-native-paper";
import { FlatList } from "react-native-gesture-handler";
import Card from "../components/Card";
import BrokenClouds from "../assets/BrokenClouds.png";
import ClearD from "../assets/ClearD.png";
import ClearN from "../assets/ClearN.png";
import FewCloudsD from "../assets/FewCloudsD.png";
import FewCloudsN from "../assets/FewCloudsN.png";
import Fog from "../assets/Fog.png";
import RainD from "../assets/RainD.png";
import RainN from "../assets/RainN.png";
import ScatteredClouds from "../assets/ScatteredClouds.png";
import ShowerRain from "../assets/ShowerRain.png";
import Snow from "../assets/Snow.png";
import Thunder from "../assets/Thunder.png";

const horizontal = vw(100) > vh(100);

const weatherColorMap = {
  "clear sky": "#84ccf9",
  "few clouds": "#5da9e1",
  "scattered clouds": "#5e9ad9",
  "broken clouds": "#657fa0",
  "shower rain": "#374667",
  rain: "#374667",
  thunderstorm: "#040a21",
  snow: "#ffffff",
  mist: "#d7e9df",
};

const Charts = ({ route }) => {
  const [time, setTime] = useState(
    `${new Date().getHours()}:${new Date().getMinutes()}`,
  );
  const { weather, image, list, background } = route.params;
  const [loaded] = useFonts({
    VarelaRound: require("../assets/VarelaRound-Regular.ttf"),
  });
  const [mode, setMode] = useState("temperature");
  const [timeMode, setTimeMode] = useState("hourly");
  const [visible, setVisible] = useState(false);
  const [pressure, setPressure] = useState(false);
  const [rain, setRain] = useState(false);
  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);
  let [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
    visible: false,
    value: 0,
  });
  const imageList = {
    "01": [ClearD, ClearN],
    "02": [FewCloudsD, FewCloudsN],
    "03": [ScatteredClouds, ScatteredClouds],
    "04": [BrokenClouds, BrokenClouds],
    "09": [ShowerRain, ShowerRain],
    "10": [RainD, RainN],
    "11": [Thunder, Thunder],
    "13": [Snow, Snow],
    "50": [Fog, Fog],
  };

  const codeToImage = (code) => {
    const codeArr = code.split("");
    const weather = `${codeArr[0]}${codeArr[1]}`;
    const time = codeArr[2] === "d" ? 0 : 1;
    return imageList[weather][time];
  };
  const convertMode = (currMode, weatherData) => {
    let returned;
    switch (currMode) {
      case "temperature":
        returned = weatherData.main.temp.toFixed(0);
        break;
      case "pressure":
        returned = weatherData.main.pressure;
        break;
      case "rain":
        const rain = weatherData.rain || { "3h": 0 };
        returned = rain["3h"];
        break;
      default:
        returned = Math.floor(Math.random() * 100);
        break;
    }
    return returned;
  };
  useEffect(() => {
    let DateTimer = setInterval(() => {
      const d = new Date();
      const dString = `${d.getHours()}:${
        d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()
      }`;
      if (time !== dString) {
        setTime(dString);
      }
    }, 1000);

    return () => clearInterval(DateTimer);
  }, []);
  if (!loaded) {
    return null;
  }

  const WeatherLabel = () => (
    <View style={styles.container}>
      <Text style={styles.Weather}>{weather.main}</Text>
    </View>
  );
  const LeftIcon = () => (
    <Image source={image} style={styles.leftIcon} resizeMode="contain"></Image>
  );
  const Time = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.time}>{time}</Text>
      </View>
    );
  };
  return (
    <Provider>
      <ImageBackground source={{ uri: background }} style={styles.background}>
        <View style={styles.wrapper}>
          <Header
            placement="left"
            leftComponent={LeftIcon}
            centerComponent={WeatherLabel}
            rightComponent={Time}
            backgroundColor={weatherColorMap[weather.description]}
          />
          <IconButton
            icon={"cog"}
            color={Colors.white}
            size={horizontal ? vh(5) : vw(5)}
            style={{ alignSelf: "flex-end" }}
            onPress={showDialog}
          ></IconButton>
          <View
            style={{
              height: horizontal ? vh(70) : vw(70),
            }}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <LineChart
                data={{
                  labels: list.map((curr) => {
                    const time = curr.dt_txt.split(" ")[1];
                    return time.slice(0, time.length - 3);
                  }),
                  datasets: [
                    {
                      data: list.map((curr) => convertMode(mode, curr)),
                    },
                  ],
                }}
                width={horizontal ? vh(500) : vw(500)}
                height={horizontal ? vh(70) : vw(70)}
                yAxisInterval={1}
                chartConfig={{
                  backgroundGradientFrom: `#000`,
                  backgroundGradientTo: "#000",
                  backgroundGradientFromOpacity: 0,
                  backgroundGradientToOpacity: 0,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) =>
                    `rgba(255, 255, 255, ${opacity})`,
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#fff",
                  },
                  decimalPlaces: 0,
                }}
                withHorizontalLabels={false}
                withVerticalLabels
                decorator={() => {
                  return tooltipPos.visible ? (
                    <View>
                      <Svg>
                        <Rect
                          x={tooltipPos.x - 15}
                          y={tooltipPos.y + 10}
                          width="40"
                          height="30"
                          fill="black"
                        />
                        <TextSVG
                          x={tooltipPos.x + 5}
                          y={tooltipPos.y + 30}
                          fill="white"
                          fontSize="16"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {tooltipPos.value}
                        </TextSVG>
                      </Svg>
                    </View>
                  ) : null;
                }}
                onDataPointClick={(data) => {
                  let isSamePoint =
                    tooltipPos.x === data.x && tooltipPos.y === data.y;

                  isSamePoint
                    ? setTooltipPos((previousState) => {
                        return {
                          ...previousState,
                          value: data.value,
                          visible: !previousState.visible,
                        };
                      })
                    : setTooltipPos({
                        x: data.x,
                        value: data.value,
                        y: data.y,
                        visible: true,
                      });
                }}
                withShadow={false}
                bezier
                withInnerLines={false}
                withOuterLines={false}
              />
            </ScrollView>
          </View>
          <Text style={{ color: "white" }}>
            {pressure.toString()} | {rain.toString()}
          </Text>
          <FlatList
            data={list}
            renderItem={({ item }) => {
              return (
                <Card
                  image={codeToImage(item.weather[0].icon)}
                  temp={item.main.temp}
                  time={item["dt_txt"]}
                ></Card>
              );
            }}
            keyExtractor={(item) => {
              return item["dt_txt"];
            }}
            horizontal
          ></FlatList>
          <Portal>
            <Dialog
              visible={visible}
              onDismiss={hideDialog}
              style={{ alignItems: "center" }}
            >
              <View style={styles.settings}>
                <Picker
                  selectedValue={mode}
                  onValueChange={(itemValue) => setMode(itemValue)}
                  style={{ width: "100%" }}
                >
                  <Picker.Item label="Temperature" value="temperature" />
                  <Picker.Item label="Pressure" value="pressure" />
                  <Picker.Item label="Rain" value="rain" />
                </Picker>
              </View>
              <ToggleButton.Row
                onValueChange={(value) =>
                  value === "pressure" ? setPressure(!pressure) : setRain(!rain)
                }
              >
                <ToggleButton icon="gauge" value="pressure" />
                <ToggleButton icon="weather-rainy" value="rain" />
              </ToggleButton.Row>
            </Dialog>
          </Portal>
        </View>
      </ImageBackground>
    </Provider>
  );
};

const styles = StyleSheet.create({
  Weather: {
    fontSize: horizontal ? vh(5) : vw(5),
    fontFamily: "VarelaRound",
    color: "#FFF",
  },
  leftIcon: {
    height: horizontal ? vh(10) : vw(10),
    width: horizontal ? vh(15) : vw(15),
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  time: {
    fontFamily: "VarelaRound",
    color: "#FFF",
    fontSize: horizontal ? vh(5) : vw(5),
  },
  settings: {
    flexDirection: "row",
    justifyContent: "center",
  },
  wrapper: {
    backgroundColor: "rgba(0,0,0,0.7)",
    flex: 1,
  },
  background: {
    width: vw(100),
    height: vh(100),
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Charts;
