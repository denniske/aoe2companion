import { View, StyleSheet, ViewStyle } from 'react-native';
import { MyText } from '../../components/my-text';
import { PlayoffRound as IPlayoffRound } from 'liquipedia';
import { createStylesheet } from '../../../../src/theming-new';
import { PlayoffMatch } from './match';

export const PlayoffRound: React.FC<{ width: ViewStyle['width']; round: IPlayoffRound }> = ({ round, width }) => {
    const styles = useStyles();
    const containsAdditionalHeader = round.matches.some((match) => match.header);
    return (
        <View style={[{ width }, styles.container]}>
            <View style={styles.nameContainer}>
                <MyText style={styles.name}>{round.name}</MyText>
                <MyText style={styles.format}>{round.format}</MyText>
            </View>

            <View style={styles.contentContainer}>
                {round.matches.map((match, index) => {
                    const style: ViewStyle = {};

                    if (index === 0) {
                        style.marginTop = 'auto';
                    }

                    const next = round.matches[index + 1];

                    if (match.header && index === round.matches.length - 1) {
                        style.position = 'absolute';
                        style.bottom = 0;
                    }

                    if ((index === round.matches.length - 1 && !containsAdditionalHeader) || next?.header) {
                        style.marginBottom = 'auto';
                    }

                    return <PlayoffMatch match={match} key={index} style={style} />;
                })}
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
