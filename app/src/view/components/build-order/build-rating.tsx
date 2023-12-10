import { createStylesheet } from '../../../theming-new';
import { StyleSheet, View } from 'react-native';
import { IBuildOrder } from '../../../../../data/src/helper/builds';
import { FontAwesome5 } from '@expo/vector-icons';
import { MyText } from '../my-text';

export const BuildRating: React.FC<IBuildOrder> = (build) => {
    const styles = useStyles();
    const filledStars = Math.round(build.avg_rating ?? 0);
    const unfilledStars = Math.round(5 - filledStars);

    return (
        <View style={styles.ratingsContainer}>
            <View style={styles.ratings}>
                {Array(filledStars)
                    .fill(null)
                    .map((_, index) => (
                        <FontAwesome5
                            name="star"
                            size={14}
                            key={`filled-${index}`}
                            color="#f7d305"
                            solid
                        />
                    ))}
                {Array(unfilledStars)
                    .fill(null)
                    .map((_, index) => (
                        <FontAwesome5
                            name="star"
                            size={14}
                            key={`unfilled-${index}`}
                            color="#f7d305"
                        />
                    ))}
            </View>
            <MyText style={styles.numberOfRatings}>
                {build.number_of_ratings}
            </MyText>
        </View>
    );
};

const useStyles = createStylesheet((theme, darkMode) =>
    StyleSheet.create({
        ratingsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        ratings: {
            flexDirection: 'row',
            gap: 2,
        },
        numberOfRatings: {
            color: theme.textNoteColor,
            fontSize: 14,
            fontWeight: 'bold',
        },
    })
);
