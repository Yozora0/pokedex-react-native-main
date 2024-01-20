import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export function TeamScreen() {
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  // Utilisez useFocusEffect pour mettre à jour les favoris chaque fois que l'écran est en premier plan
  useFocusEffect(
      useCallback(() => {
        fetchFavorites();
      }, [])
  );

  return (
      <ScrollView style={{ backgroundColor: "#374151" }}>
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>
            My Team
          </Text>
          {favorites.map((favorite) => (
              <View key={favorite.name} style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                <Image
                    source={{ uri: favorite.sprite }}
                    style={{ width: 50, height: 50, marginRight: 8 }}
                />
                <Text style={{ fontSize: 18, color: "white", textTransform: "capitalize" }}>
                  {favorite.name}
                </Text>
              </View>
          ))}
        </View>
      </ScrollView>
  );
}
