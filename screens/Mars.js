import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Animated,
} from "react-native";
import { data, images } from "../data/marsData";
import { vh, vw } from "react-native-expo-viewport-units";
import { last, directionToLetters } from "../functions";
import { Entypo, FontAwesome5, Feather, FontAwesome } from "@expo/vector-icons";
import Compass from "../components/Compass";
import { Tip } from "react-native-tip";
import { Surface, Modal, Portal, Provider } from "react-native-paper";
import { Icon } from "react-native-elements";
import ReactNativeZoomableView from "@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView";
import Gallery from "react-native-awesome-gallery";
import "react-native-gesture-handler";

export default function Mars() {
  const [marsdata, setMarsData] = useState(null);
  const [season, setSeason] = useState(null);
  const [direction, setDirection] = useState(["N"]);
  const [visible, setVisible] = React.useState(false);
  const [imageArr, setImageArr] = useState([]);
  const [imgVisible, setImgVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);
  const spin = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const slide = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: "rgba(255, 255, 255, 0)",
    padding: vw(1),
    width: vw(90),
    justifySelf: "center",
    alignSelf: "center",
    height: "100%",
    flexDirection: "row",
  };
  useEffect(() => {
    data().then(({ data }) => {
      const { sol_keys, validity_checks, ...mars } = data;
      const name = Object.keys(mars)[Object.keys(mars).length - 1];
      setMarsData({ name, ...last(mars) });
    });
    images().then(({ data: { photos } }) => {
      const arr = photos.map((curr) => curr.img_src);
      setImageArr(arr);
    });
  }, []);
  useEffect(() => {
    switch (marsdata?.Season) {
      case "spring":
        setSeason(<FontAwesome5 name="tree" size={vw(16)} color="green" />);
        break;
      case "summer":
        setSeason(<Feather name="sun" size={vw(16)} color="yellow" />);
        break;
      case "fall":
        setSeason(<FontAwesome5 name="leaf" size={vw(16)} color="orange" />);
        break;
      case "winter":
        setSeason(
          <FontAwesome name="snowflake-o" size={vw(16)} color="white" />,
        );
        break;
      default:
        setSeason(<FontAwesome name="question" size={vw(16)} color="white" />);
    }
    setDirection(directionToLetters(marsdata?.WD.most_common.compass_point));
  }, [marsdata]);
  if (marsdata) {
    return (
      <Provider>
        <ImageBackground
          style={styles.container}
          source={require("../assets/ELYSIUM.png")}
          resizeMode="cover"
        >
          <Portal>
            <Modal
              visible={visible}
              onDismiss={hideModal}
              contentContainerStyle={containerStyle}
            >
              <View
                style={{
                  width: vw(4),
                  height: "50%",
                  justifyContent: "center",
                  marginBottom: vh(1),
                }}
              >
                <Icon
                  name="cross"
                  type="entypo"
                  size={20}
                  color="red"
                  onPress={() => setVisible(false)}
                />
              </View>
              <ReactNativeZoomableView
                maxZoom={100}
                minZoom={1}
                zoomStep={0.5}
                initialZoom={1}
                bindToBorders={true}
                zoomCenteringLevelDistance={100}
              >
                <Image
                  source={require("../assets/map.png")}
                  style={styles.map}
                ></Image>
              </ReactNativeZoomableView>
              <View style={{ width: vw(4) }}></View>
            </Modal>
          </Portal>

          <Portal>
            <Modal
              visible={imgVisible}
              onDismiss={() => setImgVisible(false)}
              contentContainerStyle={containerStyle}
              transparent={true}
            >
              <View
                style={{
                  width: vw(4),
                  height: "50%",
                  justifyContent: "center",
                  marginBottom: vh(1),
                }}
              >
                <Icon
                  name="cross"
                  type="entypo"
                  size={21}
                  color="red"
                  onPress={() => setImgVisible(false)}
                />
              </View>
              <Gallery
                data={imageArr}
                onIndexChange={(newIndex) => {
                  console.log(newIndex);
                }}
                keyExtractor={(_, index) => index}
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0)",
                }}
                containerDimensions={{ width: vw(80), height: vh(75) }}
              />
              <View style={{ width: vw(4) }}></View>
            </Modal>
          </Portal>
          <View
            style={{
              flex: 1,
              width: vw(100),
              justifyContent: "flex-start",
              alignItems: "flex-start",
              paddingHorizontal: vw(1),
              alignSelf: "flex-start",
              flexDirection: "row",
            }}
          >
            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
              <Tip
                title={`wind direction: ${marsdata.WD.most_common.compass_degrees}˚ \nIterations over the sol: ${marsdata.WD.most_common.ct}`}
                titleStyle={{
                  fontFamily: "Avenir Next",
                  fontSize: vw(4.2),
                  fontWeight: "bold",
                }}
              >
                <Surface
                  style={{
                    elevation: 5,
                    borderRadius: vw(19.5 / 2),
                    backgroundColor: "rgba(255, 255, 255, 0)",
                    flexDirection: "row",
                    alignItems: "flex-end",
                  }}
                >
                  <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <Compass
                      direction={direction}
                      marsdata={marsdata}
                    ></Compass>
                  </Animated.View>
                  <FontAwesome5 name="wind" size={vw(5)} color={"#FFF"} />
                </Surface>
              </Tip>
            </Animated.View>
            <Animated.View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                opacity: fadeAnim,
                transform: [{ rotate: spin }],
              }}
            >
              <Icon
                raised
                name="images"
                type="entypo"
                reverse
                color="#c1440e"
                onPress={() => setImgVisible(true)}
              />
            </Animated.View>
            <Animated.View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "flex-end",
                opacity: fadeAnim,
                transform: [{ rotate: spin }],
              }}
            >
              <Icon
                raised
                name="map"
                type="Feather"
                reverse
                color="#663926"
                onPress={showModal}
              />
            </Animated.View>
          </View>
          {/* Circle!!!! */}
          <Animated.View
            style={[
              styles.circle,
              {
                transform: [
                  {
                    translateX: slide,
                    scale: fadeAnim,
                  },
                ],
              },
            ]}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "Avenir Next",
                fontSize: vw(6),
                fontWeight: "bold",
              }}
            >
              Sol {marsdata.name}
            </Text>
            <Text
              style={{
                color: "white",
                fontFamily: "Avenir Next",
                fontSize: vw(6),
                fontWeight: "bold",
              }}
            >
              <Entypo name="location-pin" size={vw(6)} color="red" /> Elysium
              Planatia
            </Text>
            <Text
              style={{
                color: "white",
                fontFamily: "Avenir Next",
                fontSize: vw(15),
                fontWeight: "bold",
              }}
            >
              {marsdata.AT.av.toFixed(1)}˚C
            </Text>
            {season}
          </Animated.View>
          <View
            style={{
              flex: 2,
              width: vw(100),
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          ></View>
        </ImageBackground>
      </Provider>
    );
  } else {
    return (
      <ImageBackground
        style={styles.container}
        source={require("../assets/ELYSIUM.png")}
        resizeMode="cover"
      ></ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  circle: {
    width: vw(80),
    height: vw(80),
    backgroundColor: "#000000",
    opacity: 0.4,
    borderRadius: vw(80),
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    height: vw(41),
    width: vw(80),
    shadowColor: "#FFF",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
});
