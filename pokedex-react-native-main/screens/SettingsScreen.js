import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {color} from "nativewind/dist/tailwind/native/color";

const Button = ({ onPress, title = 'Save' }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
);

export function SettingsScreen() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [showProfileInfo, setShowProfileInfo] = useState(false);

    const handleSaveProfile = () => {
        console.log('Profil sauvegardé:', { firstName, lastName, username, profileImage });
        setShowProfileInfo(true);
    };

    const handleImagePick = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            console.log('ImagePicker Result:', result);

            if (!result.cancelled) {
                const selectedImage = result.assets && result.assets.length > 0 ? result.assets[0] : null;

                if (selectedImage && selectedImage.uri) {
                    console.log('Selected Image URI:', selectedImage.uri);
                    setProfileImage(selectedImage.uri);
                } else {
                    console.log('No URI found in the selected image assets.');
                }
            } else {
                console.log('Image selection cancelled');
            }
        } catch (error) {
            console.error('Error selecting image:', error);
        }
    };



    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.topContainer}>
                {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                    <Text style={{color: "white"}}>No Profile pic Selected</Text>
                )}

                {showProfileInfo && (
                    <>
                        <Text style={styles.profileName}>
                            {lastName} {firstName}
                        </Text>

                        <Text style={styles.profileUser}>
                            @{username}
                        </Text>
                    </>
                )}

                <TouchableOpacity onPress={handleImagePick}>
                    <Text style={profileImage ? styles.changeImageText : styles.pickImageText}>
                        {profileImage ? 'Change your profile pic' : 'Pick a Profile pic'}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.label}>Firstname</Text>
                <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={(text) => setFirstName(text)}
                />

                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={(text) => setLastName(text)}
                />

                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={(text) => setUsername(text)}
                />
            </View>

            <Button onPress={handleSaveProfile} title="Save your profile" />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#121212",
        padding: 15,
    },
    topContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    input: {
        height: 40,
        width: "100%",
        borderColor: "#DDDDDD",
        backgroundColor: '#121212',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
        color: "white",
    },
    profileImage: {
        width: 130,
        height: 130,
        borderRadius: 100,
    },
    pickImageText: {
        marginTop: 10,
        color: "#ef4444",
    },
    label: {
        alignSelf: "flex-start",
        marginBottom: 5,
        marginLeft: 5,
        color: "#A1A1A1",
        textTransform: 'uppercase',
    },
    profileName: {
        marginTop: 10,
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        color: "white",
    },
    profileUser: {
        fontSize: 20,
        color: "#797979",
    },
    button: {
        backgroundColor: 'transparent',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#ef4444',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 32,
        width: '100%',
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: '#ef4444',
    },
    changeImageText: {
        marginTop: 10,
        color: "#ef4444",  // Change the color or add any other styles for visibility
    },
});

export default SettingsScreen;
