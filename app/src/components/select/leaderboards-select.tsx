import { setLeaderboardId, useMutate, useSelector } from '@app/redux/reducer';
import { useQuery } from '@tanstack/react-query';
import { fetchLeaderboards } from '@app/api/helper/api';
import { ILeaderboardDef } from '@app/api/helper/api.types';
import { FontAwesome6 } from '@expo/vector-icons';
import { leaderboardsByType } from '@app/helper/leaderboard';
import { View } from 'react-native';
import Picker from '@app/view/components/picker';
import React from 'react';
import { useAppTheme } from '@app/theming';
import { useLeaderboards } from '@app/queries/all';

interface Props {
    leaderboardIdList: string[];
    onLeaderboardIdChange?: (leaderboardIdList: [string]) => void;
}

export function LeaderboardsSelect(props: Props) {
    const { leaderboardIdList, onLeaderboardIdChange } = props;
    const theme = useAppTheme();

    const { data: leaderboards } = useLeaderboards();

    const selectedLeaderboard = leaderboards?.find(l => l.leaderboardId === leaderboardIdList?.[0]);

    const formatLeaderboard = (x: ILeaderboardDef | null, inList?: boolean) => {
        if (x == null) return 'All';
        return x.abbreviationTitle + ' ' + x.abbreviationSubtitle;
    };

    const icon = (x: any) => {
        if (x == null) return null;
        if (x.abbreviation.includes('🎮')) {
            return <FontAwesome6 name="gamepad" size={16} style={{paddingRight: 10, paddingVertical:8, color: theme.textColor}} />;
        } else {
            return <FontAwesome6 name="computer-mouse" size={16} style={{paddingRight: 10, paddingVertical:8, color: theme.textColor}} />;
        }
    };

    const onLeaderboardIdSelected = (leaderboard: ILeaderboardDef | null) => {
        onLeaderboardIdChange?.(leaderboard?.leaderboardId ? [leaderboard!.leaderboardId] : [] as any);
    };

    const loadingLeaderboard = false;

    const sections = [
        {
            title: null,
            icon: 'swords',
            data: [null],
        },
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
            textMinWidth={200}
            container="sectionlist"
            sections={sections}
            icon={icon}
            disabled={loadingLeaderboard}
            value={selectedLeaderboard}
            values={[null, ...(leaderboards ?? [])]}
            formatter={formatLeaderboard}
            onSelect={onLeaderboardIdSelected}
            style={{ width: 200 }}
        />
    );
}
