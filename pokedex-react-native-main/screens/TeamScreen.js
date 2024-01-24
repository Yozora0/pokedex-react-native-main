import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

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

    useFocusEffect(
        useCallback(() => {
            fetchFavorites();
        }, [])
    );

    const removeFromFavorites = async (pokemonName) => {
        try {
            const updatedFavorites = favorites.filter((favorite) => favorite.name !== pokemonName);
            await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            setFavorites(updatedFavorites);
            Alert.alert('Removed from favorites', `Successfully removed ${pokemonName} from favorites.`);
        } catch (error) {
            console.error('Error removing from favorites:', error);
            Alert.alert('Error', 'An error occurred while removing from favorites. Please try again.');
        }
    };

    return (
        <ScrollView style={{ backgroundColor: "#121212" }}>
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
                        <TouchableOpacity onPress={() => removeFromFavorites(favorite.name)} style={{ marginLeft: 'auto' }}>
                            <Ionicons name="heart" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}
