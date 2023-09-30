import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const Features = () => {

    const features = [
        {
            image: require("../../assets/images/chatgptIcon.png"),
            title: "ChatGPT",
            bgcolor: "#a7f3d0",
            description: "ChatGPT can provide you with instant and knowledgeable responses, assist you with creative ideas on a wide range of topics."
        },
        {
            image: require("../../assets/images/dalleIcon.png"),
            title: "Dall•E",
            bgcolor: "#e9d5ff",
            description: "DALL•E can generate imaginative and diverse images from textual descriptions, expanding the boundaries of visual creativity."
        },
        {
            image: require("../../assets/images/smartaiIcon.png"),
            title: "SmartAI",
            bgcolor: "#a5f3fc",
            description: "A powerful voice assistant with the abilities of ChatGPT and Dall•E, providing you the best of both worlds."
        }
    ];


    return (
        <View style={styles.container}>
            <Text style={styles.header}>Features</Text>
            {
                features.map((feature, index) => (
                    <View key={index} style={[{ backgroundColor: feature.bgcolor }, styles.innerContainer]}>
                        <View style={styles.featureContainer}>
                            <Image source={feature.image} style={styles.icon} />
                            <Text style={styles.title}>{feature.title}</Text>
                        </View>
                        <Text style={styles.description}>{feature.description}</Text>
                    </View>
                ))
            }

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: hp(60),
        marginTop: 16,
    },
    header: {
        fontSize: wp(6.5),
        fontWeight: "600",
        color: "#374151"
    },
    innerContainer: {
        padding: 16,
        marginTop: 16,
        borderRadius: 8,
    },
    featureContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 4,
    },
    icon: {
        height: hp(4),
        width: hp(4)
    },
    title: {
        fontSize: wp(4.8),
        fontWeight: "600",
        color: "#374151",
        marginLeft: 8
    },
    description: {
        fontSize: wp(3.8),
        fontWeight: "500",
        color: "#374151",
        marginLeft:5,
        marginTop:5
    }
});

export default Features;