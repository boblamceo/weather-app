import React from "react";
import {
  Feather,
  FontAwesome5,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { useFonts } from "expo-font";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import { Colors, DataTable, IconButton } from "react-native-paper";
import BrokenClouds from "../assets/BrokenClouds.png";
import ClearD from "../assets/ClearD.png";
import ClearN from "../assets/ClearN.png";
import FewCloudsD from "../assets/FewCloudsD.png";
import FewCloudsN from "../assets/FewCloudsN.png";
import Fog from "../assets/Fog.png";
import loader from "../assets/loader.gif";
import RainD from "../assets/RainD.png";
import RainN from "../assets/RainN.png";
import ScatteredClouds from "../assets/ScatteredClouds.png";
import ShowerRain from "../assets/ShowerRain.png";
import Snow from "../assets/Snow.png";
import Thunder from "../assets/Thunder.png";

const horizontal = vw(100) > vh(100);

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

const Data = ({ route, navigation }) => {
  const { weather, main, list, data, promiseInProgress, sys } = route.params;
  const [loaded] = useFonts({
    VarelaRound: require("../assets/VarelaRound-Regular.ttf"),
  });
  if (!loaded) {
    return null;
  }
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
    <ImageBackground source={{ uri: data.image.uri }} style={styles.background}>
      {promiseInProgress ? (
        <Image source={loader} style={styles.loader}></Image>
      ) : (
        <>
          <View style={styles.container}>
            <View style={styles.top}>
              <View style={styles.topLeft}>
                <Text style={styles.city}>
                  {data.name.length > 14
                    ? `${data.name.substring(0, 14)}...`
                    : data.name}
                </Text>
                <Text style={styles.temperature}>{main.temp.toFixed(0)}˚C</Text>
              </View>
              <View style={styles.topRight}>
                <Text style={styles.highAndLow}>
                  H: {main.temp_max.toFixed(0)}˚C
                </Text>
                <Text style={styles.highAndLow}>
                  L: {main.temp_min.toFixed(0)}˚C
                </Text>
              </View>
            </View>
            <ScrollView
              style={styles.bottom}
              contentContainerStyle={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={codeToImage(weather[0].icon)}
                style={styles.icon}
              ></Image>
              <Text style={[styles.description]}>{weather[0].main}</Text>
              <IconButton
                icon="arrow-right"
                size={horizontal ? vh(5) : vw(5)}
                color={Colors.cyan500}
                onPress={() =>
                  navigation.navigate("Charts", {
                    weather: weather[0],
                    image: codeToImage(weather[0].icon),
                    list: list,
                    background: data.image.uri,
                  })
                }
                style={{ alignSelf: "flex-end" }}
                animated
                accessibilityLabel="Charts"
                accessibilityRole="button"
              ></IconButton>
              <DataTable style={[styles.table]}>
                <DataTable.Row>
                  <DataTable.Cell numeric>
                    <SimpleLineIcons name="speedometer" color="white" />
                  </DataTable.Cell>
                  <DataTable.Cell style={{ flex: 2 }}>
                    {" "}
                    <Text style={{ color: "white" }}> Pressure</Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric style={{ flex: 2 }}>
                    {" "}
                    <Text style={{ color: "white" }}> {main.pressure} hPa</Text>
                  </DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell numeric>
                    <Ionicons name="water" color="white" />
                  </DataTable.Cell>
                  <DataTable.Cell style={{ flex: 2 }}>
                    {" "}
                    <Text style={{ color: "white" }}> Humidity</Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric style={{ flex: 2 }}>
                    {" "}
                    <Text style={{ color: "white" }}>{main.humidity}%</Text>
                  </DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell numeric>
                    <FontAwesome5 name="temperature-high" color="white" />
                  </DataTable.Cell>
                  <DataTable.Cell style={{ flex: 2 }}>
                    {" "}
                    <Text style={{ color: "white" }}> Feels Like</Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric style={{ flex: 2 }}>
                    {" "}
                    <Text style={{ color: "white" }}>{main.feels_like}˚C</Text>
                  </DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell numeric>
                    <Feather name="sunrise" color="white" />
                  </DataTable.Cell>
                  <DataTable.Cell style={{ flex: 2 }}>
                    {" "}
                    <Text style={{ color: "white" }}> Sunrise</Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric style={{ flex: 2 }}>
                    {" "}
                    <Text style={{ color: "white" }}>
                      {unixtotime(sys.sunrise)}
                    </Text>
                  </DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell numeric>
                    <Feather name="sunset" color="white" />
                  </DataTable.Cell>
                  <DataTable.Cell style={{ flex: 2 }}>
                    {" "}
                    <Text style={{ color: "white" }}> Sunset</Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric style={{ flex: 2 }}>
                    {" "}
                    <Text style={{ color: "white" }}>
                      {" "}
                      {unixtotime(sys.sunset)}
                    </Text>
                  </DataTable.Cell>
                </DataTable.Row>
              </DataTable>
            </ScrollView>
          </View>
        </>
      )}
    </ImageBackground>
  );
};
// if horizontal, 160vh, 80vh
// if vertical, 80vw, 160vh
const styles = StyleSheet.create({
  background: {
    width: vw(100),
    height: vh(100),
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    width: vw(20),
    height: vw(20),
  },
  container: {
    width: horizontal ? vh(120) : vw(80),
    height: horizontal ? vh(80) : vw(120),
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: horizontal ? vh(5) : vw(5),
    paddingHorizontal: horizontal ? vh(5) : vw(5),
    paddingVertical: horizontal ? vh(5) : vw(5),
    shadowColor: "#FFF",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
  },
  top: {
    borderBottomWidth: 1,
    paddingHorizontal: horizontal ? vh(2) : vw(2),
    paddingVertical: horizontal ? vh(2) : vw(2),
    justifyContent: "space-between",
    flexDirection: "row",
  },
  topLeft: { flexDirection: "column" },
  city: {
    color: "#969696",
    fontSize: horizontal ? vh(4.6) : vw(4.6),
    fontFamily: "VarelaRound",
  },
  temperature: {
    fontSize: horizontal ? vh(10) : vw(10),
    fontFamily: "VarelaRound",
    color: "white",
  },
  topRight: { flexDirection: "column", justifyContent: "center" },
  highAndLow: {
    fontFamily: "VarelaRound",
    fontSize: horizontal ? vh(5.5) : vw(5.5),
    color: "white",
  },
  bottom: {
    paddingHorizontal: horizontal ? vh(2) : vw(2),
    paddingVertical: horizontal ? vh(2) : vw(2),
  },
  description: {
    fontFamily: "VarelaRound",
    fontSize: horizontal ? vh(5) : vw(5),
    color: "white",
  },
  icon: {
    marginBottom: horizontal ? vh(1) : vw(1),
  },
  table: {
    backgroundColor: "#121212",
    marginTop: horizontal ? vh(3) : vw(3),
    borderRadius: horizontal ? vh(3) : vw(3),
    color: "white",
  },
});

export default Data;
