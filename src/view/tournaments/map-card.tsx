import { Card } from '@app/components/card';
import { Text } from '@app/components/text';
import { Image } from '@/src/components/uniwind/image';
import { Map } from '@app/api/liquipedia.types';
import { Linking } from 'react-native';

// Liquipedia's v3 API has no map data, so a map links to its wiki page rather than opening details in the app.
export const MapCard: React.FC<{ map: Map }> = ({ map }) => {
    return (
        <Card
            direction="vertical"
            className="p-4 w-36 gap-0"
            onPress={() => Linking.openURL(`https://liquipedia.net/ageofempires/${encodeURIComponent(map.name.replace(/ /g, '_'))}`)}
        >
            {!!map.image && <Image source={{ uri: map.image }} contentFit="contain" style={{ aspectRatio: 2 }} />}
            <Text align="center" variant="label" className={map.image ? 'mt-2' : ''} numberOfLines={1}>
                {map.name}
            </Text>
            {!!map.category && (
                <Text align="center" variant="body-xs" numberOfLines={1}>
                    {map.category}
                </Text>
            )}
        </Card>
    );
};
