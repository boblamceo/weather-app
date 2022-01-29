import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import Earth from "./screens/Earth";
import Mars from "./screens/Mars";
import Marsimg from "./assets/mars.png";
import Earthimg from "./assets/earth.png";
import { Image } from "react-native";
import TipProvider from "react-native-tip";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen
          name="Earth"
          component={Earth}
          options={{
            headerTitle: () => (
              <Image style={{ width: 50, height: 50 }} source={Earthimg} />
            ),
            headerStyle: {
              backgroundColor: "#70483C",
            },
          }}
        />
        {/* <Drawer.Screen
          name="Mars"
          component={Mars}
          options={{
            headerTitle: () => (
              <Image style={{ width: 50, height: 50 }} source={Marsimg} />
            ),
            headerStyle: {
              backgroundColor: "#CC3333",
            },
          }}
        /> */}
      </Drawer.Navigator>
      <TipProvider></TipProvider>
    </NavigationContainer>
  );
}
