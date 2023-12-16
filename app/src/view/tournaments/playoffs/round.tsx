import { View, StyleSheet } from 'react-native';
import { MyText } from '../../components/my-text';
import { PlayoffRound as IPlayoffRound } from 'liquipedia';
import { createStylesheet } from '../../../../src/theming-new';
import { PlayoffMatch } from './match';

export const PlayoffRound: React.FC<{ width: number; round: IPlayoffRound }> = ({ round, width }) => {
    const styles = useStyles();
    return (
        <View style={[{ width }, styles.container]}>
            <MyText style={styles.name}>{round.name}</MyText>

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
        name: {
            fontWeight: '500',
            fontSize: 16,
        },
    })
);
