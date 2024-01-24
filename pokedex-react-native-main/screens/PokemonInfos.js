import React, { useEffect, useState } from "react";
import { Text, View, Image, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

export function PokemonInfos({ route, navigation }) {
  const pokemonData = route.params.pokemonData;
  const [types, setTypes] = useState([]);
  const [evolutions, setEvolutions] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchTypes = async () => {
      const typePromises = pokemonData.types.map(async (type) => {
        const response = await axios.get(type.type.url);
        return response.data.name;
      });
      const typeNames = await Promise.all(typePromises);
      setTypes(typeNames);
    };

    const fetchEvolutions = async () => {
      const speciesUrl = pokemonData.species.url;
      const response = await axios.get(speciesUrl);
      const evolutionChainUrl = response.data.evolution_chain.url;

      const evolutionResponse = await axios.get(evolutionChainUrl);
      const evolutionChain = evolutionResponse.data.chain;

      const getEvolutionDetails = async (evolution) => {
        try {
          const spriteResponse = await axios.get(evolution.species.url);
          const spriteUrl = spriteResponse.data.sprites;

          return {
            name: evolution.species.name,
            sprite: spriteUrl,
          };
        } catch (error) {
          console.error("Error fetching evolution sprite:", error);
          return {
            name: evolution.species.name,
            sprite: "",
          };
        }
      };

      const evolutions = [];
      let currentEvolution = evolutionChain;

      do {
        const evolutionDetails = await getEvolutionDetails(currentEvolution);
        evolutions.push(evolutionDetails);

        if (currentEvolution.evolves_to.length > 0) {
          currentEvolution = currentEvolution.evolves_to[0];
        } else {
          break;
        }
      } while (currentEvolution);

      setEvolutions(evolutions);
    };

    const checkFavoriteStatus = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          const favorites = JSON.parse(storedFavorites);
          const isPokemonFavorite = favorites.some(favorite => favorite.name === pokemonData.name);
          setIsFavorite(isPokemonFavorite);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    const updateFavoriteStatus = () => {
      checkFavoriteStatus();
    };

    fetchTypes();
    fetchEvolutions();
    checkFavoriteStatus();

    const unsubscribe = navigation.addListener('focus', updateFavoriteStatus);

    return () => {
      unsubscribe();
    };
  }, [pokemonData, navigation]);

  const toggleFavorite = async () => {
    const newFavorite = {
      name: pokemonData.name,
      sprite: pokemonData.sprites.front_default,
    };

    try {
      let updatedFavorites = [];
      const storedFavorites = await AsyncStorage.getItem('favorites');

      if (storedFavorites) {
        updatedFavorites = JSON.parse(storedFavorites);
        const existingIndex = updatedFavorites.findIndex(favorite => favorite.name === newFavorite.name);

        if (existingIndex !== -1) {
          updatedFavorites.splice(existingIndex, 1);
        } else {
          updatedFavorites.push(newFavorite);
        }
      } else {
        updatedFavorites.push(newFavorite);
      }

      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  return (
      <ScrollView style={{ backgroundColor: "#121212" }}>
        <View style={{ padding: 16, alignItems: "center" }}>
          <Image
              source={{ uri: pokemonData.sprites.front_default }}
              style={{ width: 150, height: 150, marginBottom: 16 }}
          />
          <TouchableOpacity onPress={toggleFavorite} style={{ position: 'absolute', top: 16, right: 16 }}>
            <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={32} color={isFavorite ? 'red' : 'white'} />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "white", textTransform: "capitalize" }}>
            {pokemonData.name}
          </Text>
        </View>
        <View style={{ marginTop: 16, paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 18, color: "white" }}>
            Height: {pokemonData.height} dm
          </Text>
          <Text style={{ fontSize: 18, color: "white" }}>
            Weight: {pokemonData.weight} hg
          </Text>
          <Text style={{ fontSize: 18, color: "white" }}>
            Types: {types.join(", ")}
          </Text>
          <Text style={{ fontSize: 18, color: "white", marginTop: 8 }}>
            Evolutions:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
            <View style={{ flexDirection: "row" }}>
              {evolutions.map((evolution) => (
                  <View key={evolution.name} style={{ flexDirection: "column", alignItems: "center", marginRight: 16 }}>
                    <Image
                        source={{ uri: evolution.sprite }}
                        style={{ width: 50, height: 50, marginBottom: 8 }}
                    />
                    <Text style={{ fontSize: 16, color: "white", textTransform: "capitalize" }}>
                      {evolution.name}
                    </Text>
                  </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
  );
}
