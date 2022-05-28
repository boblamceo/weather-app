import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CitySearch from "./screens/CitySearch";
import { NavigationContainer } from "@react-navigation/native";
import Data from "./screens/Data";
import Charts from "./screens/Charts";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name={"City Search"}
          component={CitySearch}
        ></Stack.Screen>
        <Stack.Screen name={"Data"} component={Data}></Stack.Screen>
        <Stack.Screen name="Charts" component={Charts}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
