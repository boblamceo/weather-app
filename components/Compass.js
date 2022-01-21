import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { degreesrotation } from "../functions";
import { Ionicons } from "@expo/vector-icons";
import { vh, vw } from "react-native-expo-viewport-units";

const Compass = ({ direction, marsdata }) => {
  return (
    <>
      <View style={styles.ns}>
        <Text
          style={[
            direction.includes("N") ? { color: "#2a9d84" } : { color: "#000" },
            {
              fontFamily: "Avenir Next",
              fontSize: vw(4.2),
              fontWeight: "bold",
            },
          ]}
        >
          N
        </Text>
      </View>
      <View style={styles.mid}>
        <View style={styles.submid}>
          <Text
            style={[
              direction.includes("W")
                ? { color: "#2a9d84" }
                : { color: "#000" },
              {
                fontFamily: "Avenir Next",
                fontSize: vw(4.2),
                fontWeight: "bold",
              },
            ]}
          >
            W
          </Text>
        </View>
        <View>
          <Ionicons
            name="ios-compass-sharp"
            size={vw(11)}
            color="black"
            style={[
              styles.compass,
              {
                transform: [
                  {
                    rotate: `${degreesrotation(
                      315,
                      marsdata.WD.most_common.compass_degrees,
                    )}deg`,
                  },
                ],
              },
            ]}
          />
        </View>
        <View style={styles.submid}>
          <Text
            style={[
              direction.includes("E")
                ? { color: "#2a9d84" }
                : { color: "#000" },
              {
                fontFamily: "Avenir Next",
                fontSize: vw(4.2),
                fontWeight: "bold",
              },
            ]}
          >
            E
          </Text>
        </View>
      </View>
      <View style={styles.ns}>
        <Text
          style={[
            direction.includes("S") ? { color: "#2a9d84" } : { color: "#000" },
            {
              fontFamily: "Avenir Next",
              fontSize: vw(4.2),
              fontWeight: "bold",
            },
          ]}
        >
          S
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  compass: {
    opacity: 0.4,
  },
  ns: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: vw(19.5),
  },
  mid: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: vw(19.5),
  },
  submid: {
    flex: 1,
  },
});

export default Compass;
