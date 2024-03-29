import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, FlatList, ActivityIndicator } from "react-native";
import axios from "axios";
import { CardPokemon } from "../components/CardPokemon";

export function HomeScreen({ navigation }) {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAllPokemon = async () => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=1000`);
      setPokemonList(response.data.results);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPokemon();
  }, []);

  const renderPokemon = ({ item }) => (
      <CardPokemon
          pokemonName={item.name}
          pokemonUrl={item.url}
          navigation={navigation}
      />
  );

  const filteredPokemon = pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <View style={styles.container}>
        <Text style={styles.heading}>Pokedex</Text>
        <TextInput
            style={styles.searchBar}
            placeholderTextColor="white"
            placeholder="Search Pokemon..."
            onChangeText={(text) => setSearchTerm(text)}
            value={searchTerm}
        />
        {!loading && filteredPokemon.length === 0 && (
            <Text style={{ color: "white" }}>No matching Pokemon found.</Text>
        )}
        <FlatList
            data={filteredPokemon}
            numColumns={2}
            contentContainerStyle={{ gap: 8 }}
            columnWrapperStyle={{ gap: 8 }}
            renderItem={renderPokemon}
            keyExtractor={(item) => item.url}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  searchBar: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    color: "white",
  },
});
