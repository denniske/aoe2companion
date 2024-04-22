import { Card } from '@app/components/card';
import { FlatList } from '@app/components/flat-list';
import { Text } from '@app/components/text';
import { Image } from 'expo-image';
import { TournamentDetail } from 'liquipedia';

export const TournamentMaps: React.FC<{ maps: TournamentDetail['maps'] }> = ({ maps }) => {
    return (
        <FlatList
            horizontal
            data={maps}
            contentContainerStyle="gap-2"
            keyExtractor={(map) => map.name}
            renderItem={({ item: map }) => (
                <Card direction="vertical" className="p-4 w-36">
                    {map.image && <Image source={{ uri: map.image }} contentFit="contain" style={{ aspectRatio: 2 }} />}
                    <Text align="center" variant="label">
                        {map.name}
                    </Text>
                    {map.category && (
                        <Text align="center" variant="body-xs">
                            {map.category}
                        </Text>
                    )}
                </Card>
            )}
        />
    );
};
