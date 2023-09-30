import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

function WelcomeScreen() {

    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainerTop}>
                <Text style={styles.title}>Jarvis</Text>
                <Text style={styles.subtitle}>Powered by AI</Text>
            </View>
            <View style={styles.innerContainerBottom}>
                <Image source={require("../../assets/images/JarvisIcon.png")} style={styles.image} />
            </View>
            <TouchableOpacity style={styles.getStarted} onPress={() => navigation.navigate("Home")}>
                <Text style={styles.getStartedText}>Get Started</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1,
        justifyContent: "space-around",
        backgroundColor: "white"
    },
    title: {
        textAlign: "center",
        fontWeight: "bold",
        color: "#167794",
        fontSize: wp(10)
    },
    subtitle: {
        textAlign: "center",
        fontWeight: "normal",
        color: "#374151",
        fontSize: wp(4)
    },
    innerContainerTop: {
        marginTop: 8
    },
    innerContainerBottom: {
        flexDirection: "row",
        justifyContent: "center"
    },
    image: {
        height: wp(75),
        width: wp(75),
    },
    getStarted: {
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 16,
        backgroundColor: "#3b88b8"
    },
    getStartedText: {
        textAlign: "center",
        fontWeight: "bold",
        color: "white",
        fontSize: wp(6)
    }
});

export default WelcomeScreen;