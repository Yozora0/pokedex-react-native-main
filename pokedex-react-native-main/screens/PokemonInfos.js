import React, { useEffect, useState } from "react";
import { Text, View, Image, ScrollView, TouchableOpacity } from "react-native";
import axios from "axios";
import { TeamScreen} from "./TeamScreen";

export function PokemonInfos({ route, navigation }) {
  const pokemonData = route.params.pokemonData;
  const [types, setTypes] = useState([]);
  const [evolutions, setEvolutions] = useState([]);

  useEffect(() => {
    // Fonction pour obtenir les détails des types
    const fetchTypes = async () => {
      const typePromises = pokemonData.types.map(async (type) => {
        const response = await axios.get(type.type.url);
        return response.data.name;
      });
      const typeNames = await Promise.all(typePromises);
      setTypes(typeNames);
    };

    // Fonction pour obtenir les détails des évolutions
    const fetchEvolutions = async () => {
      const speciesUrl = pokemonData.species.url;
      const response = await axios.get(speciesUrl);
      const evolutionChainUrl = response.data.evolution_chain.url;

      const evolutionResponse = await axios.get(evolutionChainUrl);
      const evolutionChain = evolutionResponse.data.chain;

      // Récupérer les noms et les sprites des évolutions
      const getEvolutionDetails = async (evolution) => {
        try {
          const spriteResponse = await axios.get(evolution.species.url);
          const spriteUrl = spriteResponse.data.sprites?.front_default || "";

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

    // Appel des fonctions pour obtenir les types et les évolutions
    fetchTypes();
    fetchEvolutions();
  }, [pokemonData]);

  const addToTeam = () => {
    // Vous pouvez ajuster la logique pour ajouter le Pokémon à votre équipe ici
    // Dans cet exemple, nous naviguons vers l'écran "TeamScreen" avec les données du Pokémon
    navigation.navigate("TeamScreen", { pokemonData });
  };

  return (
      <ScrollView style={{ backgroundColor: "#374151" }}>
        <View>
          <Image
              source={{ uri: pokemonData.sprites.front_default }}
              style={{ width: 150, height: 150, marginBottom: 16 }}
          />
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
            {evolutions.map((evolution) => (
                <View key={evolution.name} style={{ flexDirection: "column", marginRight: 16 }}>
                  <Image
                      source={{ uri: evolution.sprite }}
                      style={{ width: 50, height: 50, marginBottom: 8 }}
                  />
                  <Text style={{ fontSize: 16, color: "white", textTransform: "capitalize" }}>
                    {evolution.name}
                  </Text>
                </View>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={addToTeam} style={{ backgroundColor: "#4CAF50", padding: 10, marginTop: 16, borderRadius: 5 }}>
            <Text style={{ color: "white", textAlign: "center" }}>Add to the team</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
  );
}
