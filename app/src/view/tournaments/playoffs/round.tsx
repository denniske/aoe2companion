import { View, StyleSheet, ViewStyle } from 'react-native';
import { MyText } from '../../components/my-text';
import { PlayoffRound as IPlayoffRound } from 'liquipedia';
import { createStylesheet } from '../../../../src/theming-new';
import { PlayoffMatch } from './match';

export const PlayoffRound: React.FC<{ width: ViewStyle['width']; round: IPlayoffRound }> = ({ round, width }) => {
    const styles = useStyles();
    return (
        <View style={[{ width }, styles.container]}>
            <View style={styles.nameContainer}>
                <MyText style={styles.name}>{round.name}</MyText>
                <MyText style={styles.format}>{round.format}</MyText>
            </View>

            <View style={styles.contentContainer}>
                {round.matches.map((match, index) => (
                    <PlayoffMatch match={match} key={index} />
                ))}
            </View>
        </View>
    );
};

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: 10,
            gap: 8,
        },
        contentContainer: {
            flex: 1,
            justifyContent: 'center',
            gap: 8,
            position: 'relative',
        },
        nameContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        name: {
            fontWeight: '500',
            fontSize: 16,
        },
        format: {
            fontWeight: '500',
        },
    })
);
