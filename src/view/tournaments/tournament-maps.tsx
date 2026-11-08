import { FlatList } from '@app/components/flat-list';
import { TournamentDetail } from '@app/api/liquipedia.types';

import { MapCard } from './map-card';

export const TournamentMaps: React.FC<{ maps: TournamentDetail['maps'] }> = ({ maps }) => {
    return (
        <FlatList
            horizontal
            data={maps}
            contentContainerClassName="gap-2 px-4"
            keyExtractor={(map) => map.name}
            renderItem={({ item: map }) => <MapCard map={map} />}
            showsHorizontalScrollIndicator={false}
        />
    );
};
