import { setLeaderboardId, useMutate, useSelector } from '@app/redux/reducer';
import { useQuery } from '@tanstack/react-query';
import { fetchLeaderboards } from '@app/api/helper/api';
import { ILeaderboardDef } from '@app/api/helper/api.types';
import { FontAwesome6 } from '@expo/vector-icons';
import { leaderboardIdsByType, leaderboardsByType } from '@app/helper/leaderboard';
import { View } from 'react-native';
import Picker from '@app/view/components/picker';
import React, { useMemo } from 'react';
import { useAppTheme } from '@app/theming';
import { useLeaderboards } from '@app/queries/all';
import { isEqual } from 'lodash';

interface Props {
    leaderboardIdList: string[];
    onLeaderboardIdChange?: (leaderboardIdList: string[]) => void;
}

export function LeaderboardsSelect(props: Props) {
    const { leaderboardIdList, onLeaderboardIdChange } = props;
    const theme = useAppTheme();

    const { data: leaderboards } = useLeaderboards();

    const selectedLeaderboard = useMemo(() => {
        if (!leaderboardIdList || !leaderboards) {
            return;
        }

        if (isEqual(leaderboardIdsByType(leaderboards, 'pc'), leaderboardIdList)) {
            return 'PC';
        }

        if (isEqual(leaderboardIdsByType(leaderboards, 'xbox'), leaderboardIdList)) {
            return 'Console';
        }

        return leaderboards?.find((l) => l.leaderboardId === leaderboardIdList?.[0]);
    }, [leaderboardIdList, leaderboards]);

    const formatLeaderboard = (x: ILeaderboardDef | string | null, inList?: boolean) => {
        if (x == null) return inList ? 'All' : 'All Leaderboards';
        if (typeof x === 'string') return inList ? 'All' : `All ${x}`;
        return x.abbreviationTitle + ' ' + x.abbreviationSubtitle;
    };

    const icon = (x: any) => {
        if (x == null) return null;
        if (typeof x === 'string') {
            if (x === 'PC') {
                return <FontAwesome6 name="computer-mouse" size={16} style={{ paddingRight: 10, paddingVertical: 8, color: theme.textColor }} />;
            } else if (x === 'Console') {
                return <FontAwesome6 name="gamepad" size={16} style={{ paddingRight: 10, paddingVertical: 8, color: theme.textColor }} />;
            }

            return null;
        }
        if (x.abbreviation.includes('🎮')) {
            return <FontAwesome6 name="gamepad" size={16} style={{ paddingRight: 10, paddingVertical: 8, color: theme.textColor }} />;
        } else {
            return <FontAwesome6 name="computer-mouse" size={16} style={{ paddingRight: 10, paddingVertical: 8, color: theme.textColor }} />;
        }
    };

    const onLeaderboardIdSelected = (leaderboard: ILeaderboardDef | string | null) => {
        let leaderboardIds: string[] = [];
        if (typeof leaderboard === 'string') {
            if (leaderboard === 'PC' && leaderboards) {
                leaderboardIds = leaderboardIdsByType(leaderboards, 'pc');
            } else if (leaderboard === 'Console' && leaderboards) {
                leaderboardIds = leaderboardIdsByType(leaderboards, 'xbox');
            }
        } else if (leaderboard) {
            leaderboardIds = [leaderboard.leaderboardId];
        }

        onLeaderboardIdChange?.(leaderboardIds);
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
            data: ['PC', ...leaderboardsByType(leaderboards ?? [], 'pc')],
        },
        {
            title: 'Console',
            icon: 'swords',
            data: ['Console', ...leaderboardsByType(leaderboards ?? [], 'xbox')],
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
            formatter={formatLeaderboard}
            onSelect={onLeaderboardIdSelected}
            style={{ width: 200 }}
        />
    );
}
