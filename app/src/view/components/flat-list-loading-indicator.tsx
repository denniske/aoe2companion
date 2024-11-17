import {ActivityIndicator, StyleSheet, View} from "react-native";
import React from "react";

export default function FlatListLoadingIndicator() {
    return (
        <View style={styles.loadMoreIndicator}>
            <ActivityIndicator animating size="large" color="#999" />
        </View>
    );
}


const styles = StyleSheet.create({
    loadMoreIndicator: {
        paddingTop: 50,
        paddingBottom: 30,
        justifyContent: 'center',
    },
});
