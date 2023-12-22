import { createStylesheet } from '../../theming-new';
import { TournamentDetail } from 'liquipedia';
import { View, StyleSheet } from 'react-native';
import { MyText } from '../components/my-text';
import { Image } from 'expo-image';

export const TournamentMaps: React.FC<{ maps: TournamentDetail['maps'] }> = ({ maps }) => {
    const styles = useStyles();
    return (
        <View style={styles.container}>
            {maps.map((map) => (
                <View key={map.name} style={styles.card}>
                    <View key={map.name} style={styles.cardBody}>
                        {map.image && <Image source={{ uri: map.image }} style={styles.image} />}
                        <MyText style={styles.name}>{map.name}</MyText>
                        {map.category && <MyText style={styles.category}>{map.category}</MyText>}
                    </View>
                </View>
            ))}
        </View>
    );
};

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginHorizontal: -5,
        },
        card: {
            width: '50%',
            padding: 5,
            flexDirection: 'row',
        },
        cardBody: {
            backgroundColor: theme.skeletonColor,
            flex: 1,
            padding: 10,
        },
        image: {
            aspectRatio: 2,
            resizeMode: 'contain',
        },
        name: {
            fontSize: 16,
            fontWeight: '500',
            textAlign: 'center',
            paddingTop: 8,
        },
        category: {
            fontSize: 12,
            textAlign: 'center',
        },
    })
);
