import { useTournaments } from '../../api/tournaments';
import { createStylesheet } from '../../theming-new';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { TournamentCard } from './tournament-card';
import { Age2TournamentCategory, TournamentCategory } from 'liquipedia';
import { useState } from 'react';
import { Tag } from '../components/tag';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { startCase } from 'lodash';

export const TournamentsList: React.FC = () => {
    const categories = Object.values(Age2TournamentCategory);
    const styles = useStyles();
    const [selectedCategory, setSelectedCategory] = useState<TournamentCategory>(Age2TournamentCategory.TierS);
    const { data: tournaments, isFetching, refetch } = useTournaments(selectedCategory);

    return (
        <FlatList
            style={styles.container}
            onRefresh={refetch}
            refreshing={isFetching}
            ListHeaderComponent={
                <View style={styles.tagsContainer}>
                    {categories.map((category) => (
                        <TouchableOpacity onPress={() => setSelectedCategory(category)} key={category}>
                            <Tag selected={category === selectedCategory}>{startCase(category.split('/').at(-1)?.split('Tournament')[0])}</Tag>
                        </TouchableOpacity>
                    ))}
                </View>
            }
            contentContainerStyle={styles.contentContainer}
            data={tournaments}
            keyExtractor={(item) => item.path}
            renderItem={({ item: tournament }) => <TournamentCard {...tournament} />}
        />
    );
};

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        contentContainer: {
            gap: 8,
            padding: 10,
        },
        tagsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 6,
        },
    })
);
