import { Picker, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';


export default function Header() {
    const [game, setGame] = useState('aoe2de');
    const [view, setView] = useState('my-matches');

    return (
            <View style={styles.container}>
                <Picker
                        selectedValue={game}
                        mode={'dropdown'}
                        style={{height: 50, width: 130}}
                        onValueChange={(itemValue, itemIndex) =>
                                setGame(itemValue)
                        }>
                    <Picker.Item label="AoE2:DE" value="aoe2de" />
                    <Picker.Item label="AoE2:HD" value="aoe2hd" />
                </Picker>
                <Picker
                        selectedValue={view}
                        style={{height: 50, width: 160}}
                        onValueChange={(itemValue, itemIndex) =>
                                setView(itemValue)
                        }>
                    <Picker.Item label="Leaderboard Team Random Map" value="leaderboard" />
                    <Picker.Item label="My Matches" value="my-matches" />
                </Picker>
            </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        flexDirection: 'row',
        backgroundColor: '#f00',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
});
