import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, FlatList } from "react-native";
import axios from "axios";
import { CardPokemon } from "../components/CardPokemon";

export function HomeScreen({ navigation }) {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const gap = 8;

  const fetchPokemonList = async () => {
    try {
      const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`
      );
      setPokemonList((prevList) => [...prevList, ...response.data.results]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemonList();
  }, [offset]);

  const loadMorePokemon = () => {
    setOffset(offset + limit);
  };

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
            contentContainerStyle={{ gap }}
            columnWrapperStyle={{ gap }}
            renderItem={renderPokemon}
            keyExtractor={(item) => item.url}
            onEndReached={loadMorePokemon}
            onEndReachedThreshold={0.5}
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
