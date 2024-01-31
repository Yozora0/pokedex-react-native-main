import * as React from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import pages
import { HomeScreen } from "./screens/HomeScreen";
import { TeamScreen } from "./screens/TeamScreen";
import { PokemonInfos } from "./screens/PokemonInfos";
import { SettingsScreen } from "./screens/SettingsScreen";
import {Screen} from "react-native-screens";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              backgroundColor: "#262626",
              paddingTop: 10,
            },
            style: {
              backgroundColor: "transparent",
            },
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Pokedex") {
                iconName = focused ? "ios-home" : "ios-home-outline";
              } else if (route.name === "Team") {
                iconName = focused ? "ios-people" : "ios-people-outline";
              } else if (route.name === "Settings"){
                  iconName = focused ? "ios-cog" : "ios-cog-outline";
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#ef4444",
            tabBarInactiveTintColor: "#ffffff",
          })}
          sceneContainerStyle={{ backgroundColor: "transparent" }}
        >
          <Tab.Screen
            name="Pokedex"
            component={HomeStack}
            // options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Team"
            component={TeamStack}
            // options={{ headerShown: false }}
          />
            <Tab.Screen
                name="Settings"
                component={SettingsStack}
                // options={{ headerShown: false }}
            />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen}
      options={{headerStyle:{ backgroundColor: '#ef4444'}}} />
      <Stack.Screen name="Details" component={PokemonInfos}
                    options={{headerStyle:{ backgroundColor: '#ef4444'}}}/>
    </Stack.Navigator>
  );
}

function TeamStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Favorites" component={TeamScreen}
                          options={{ headerStyle: { backgroundColor: '#ef4444' } }} />
        </Stack.Navigator>
    );
}

function SettingsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Profile" component={SettingsScreen}
                          options={{ headerStyle: { backgroundColor: '#ef4444' } }} />
        </Stack.Navigator>
    );
}



