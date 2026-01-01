import { setLeaderboardId, useMutate, useSelector } from '@app/redux/reducer';
import { useQuery } from '@tanstack/react-query';
import { fetchLeaderboards } from '@app/api/helper/api';
import { ILeaderboardDef } from '@app/api/helper/api.types';
import { FontAwesome6 } from '@expo/vector-icons';
import { leaderboardIdsByType, leaderboardsByType } from '@app/helper/leaderboard';
import { View } from 'react-native';
import Picker from '@app/view/components/picker';
import React, { useEffect } from 'react';
import { useAppTheme } from '@app/theming';
import { useLeaderboards } from '@app/queries/all';
import { usePrefData } from '@app/queries/prefs';
import { useSavePrefsMutation } from '@app/mutations/save-account';

interface Props {
    leaderboardId?: string | null;
    onLeaderboardIdChange?: (leaderboardId: string | null) => void;
}

export function LeaderboardSelect(props: Props) {
    const { leaderboardId, onLeaderboardIdChange } = props;
    const savedLeaderboards = usePrefData((state) => state?.selectedLeaderboards);
    const savePrefsMutation = useSavePrefsMutation();

    const theme = useAppTheme();

    const { data: leaderboards } = useLeaderboards();

    useEffect(() => {
        if (savedLeaderboards && leaderboards) {
            let leaderboardId: string | null = null;
            const matchingLeaderboard = leaderboards.find((l) => l.leaderboardId === savedLeaderboards);
            if (savedLeaderboards === 'PC') {
                leaderboardId = leaderboardIdsByType(leaderboards, 'pc')[0];
            } else if (savedLeaderboards === 'Console') {
                leaderboardId = leaderboardIdsByType(leaderboards, 'xbox')[0];
            } else if (matchingLeaderboard) {
                leaderboardId = matchingLeaderboard.leaderboardId;
            }

            const leaderboard = leaderboards.find((l) => l.leaderboardId === leaderboardId);

            if (leaderboardId && leaderboard) {
                onLeaderboardIdSelected(leaderboard);
            }
        }
    }, [savedLeaderboards, leaderboards]);

    const selectedLeaderboard = leaderboards?.find((l) => l.leaderboardId === leaderboardId);

    const formatLeaderboard = (x: ILeaderboardDef, inList?: boolean) => {
        if (x == null) return '';
        return x.abbreviationTitle + ' ' + x.abbreviationSubtitle;
    };

    const icon = (x: any) => {
        if (x == null) return null;
        if (x.abbreviation.includes('🎮')) {
            return <FontAwesome6 name="gamepad" size={16} style={{ paddingRight: 10, paddingVertical: 8, color: theme.textColor }} />;
        } else {
            return <FontAwesome6 name="computer-mouse" size={16} style={{ paddingRight: 10, paddingVertical: 8, color: theme.textColor }} />;
        }
    };

    const onLeaderboardIdSelected = (leaderboard: ILeaderboardDef) => {
        onLeaderboardIdChange?.(leaderboard?.leaderboardId);
    };

    const loadingLeaderboard = false;

    // <ActivityIndicator animating={loadingLeaderboard} size="small" color="#999"/>

    const sections = [
        {
            title: 'PC',
            icon: 'swords',
            data: leaderboardsByType(leaderboards ?? [], 'pc'),
        },
        {
            title: 'Console',
            icon: 'swords',
            data: leaderboardsByType(leaderboards ?? [], 'xbox'),
        },
    ];

    return (
        <Picker
            popupAlign="left"
            itemHeight={40}
            textMinWidth={150}
            container="sectionlist"
            sections={sections}
            icon={icon}
            disabled={loadingLeaderboard}
            value={selectedLeaderboard}
            values={leaderboards}
            formatter={formatLeaderboard}
            onSelect={(leaderboard) => {
                savePrefsMutation.mutate({ selectedLeaderboards: leaderboard.leaderboardId });
                onLeaderboardIdSelected(leaderboard);
            }}
            style={{ width: 150 }}
        />
    );
}
