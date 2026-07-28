import { ILeaderboardDef } from '@app/api/helper/api.types';
import { leaderboardIdsByType, leaderboardsByType } from '@app/helper/leaderboard';
import Picker from '@app/view/components/picker';
import React, { useEffect, useMemo } from 'react';
import { useAppTheme } from '@app/theming';
import { useLeaderboards } from '@app/queries/all';
import { usePrefData } from '@app/queries/prefs';
import { useSavePrefsMutation } from '@app/mutations/save-account';
import { Icon } from '@app/components/icon';
import { faComputerMouse, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'expo-router';

interface Props {
    leaderboardId?: string | null;
    onLeaderboardIdChange?: (leaderboardId: string | null) => void;
    initialLeaderboardId?: string | null;
}

export function LeaderboardOfficialSelect(props: Props) {
    const { leaderboardId, onLeaderboardIdChange, initialLeaderboardId } = props;
    const savedLeaderboards = usePrefData((state) => state?.selectedOfficialLeaderboards);
    const savePrefsMutation = useSavePrefsMutation();
    const router = useRouter();

    const { data: allLeaderboards } = useLeaderboards();
    const leaderboards = useMemo(() => allLeaderboards?.filter(l => l.official), [allLeaderboards]);

    const onLeaderboardIdSelected = (leaderboard: ILeaderboardDef) => {
        onLeaderboardIdChange?.(leaderboard.leaderboardId);
    };

    useEffect(() => {
        if (!leaderboards) return;

        let leaderboardId: string | null = null;

        if (initialLeaderboardId) {
            const matchingLeaderboard = leaderboards.find((l) => l.leaderboardId === initialLeaderboardId);
            leaderboardId = matchingLeaderboard?.leaderboardId ?? null;
        }

        if (!leaderboardId) {
            if (savedLeaderboards === 'PC') {
                leaderboardId = leaderboardIdsByType(leaderboards, 'pc')[0];
            } else if (savedLeaderboards === 'Console') {
                leaderboardId = leaderboardIdsByType(leaderboards, 'xbox')[0];
            } else if (savedLeaderboards) {
                const matchingLeaderboard = leaderboards.find((l) => l.leaderboardId === savedLeaderboards);
                leaderboardId = matchingLeaderboard?.leaderboardId ?? null;
            }
        }

        if (!leaderboardId) {
            leaderboardId = leaderboards[0]?.leaderboardId ?? null;
        }

        const leaderboard = leaderboards.find((l) => l.leaderboardId === leaderboardId);

        if (leaderboard) {
            onLeaderboardIdSelected(leaderboard);
        }
    }, [initialLeaderboardId, savedLeaderboards, leaderboards, onLeaderboardIdSelected]);

    const selectedLeaderboard = leaderboards?.find((l) => l.leaderboardId === leaderboardId);

    const formatLeaderboard = (x: ILeaderboardDef, inList?: boolean) => {
        if (x == null) return '';
        return x.abbreviationTitle + ' ' + x.abbreviationSubtitle;
    };

    const icon = (x: any) => {
        if (x == null) return null;
        if (x.abbreviation.includes('🎮')) {
            return <Icon icon={faGamepad} size={20} className="mr-2" />;
        } else {
            return <Icon icon={faComputerMouse} size={16} className="mr-2" />;
        }
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
            formatter={formatLeaderboard}
            onSelect={(leaderboard) => {
                savePrefsMutation.mutate({ selectedOfficialLeaderboards: leaderboard.leaderboardId });
                router.setParams({ leaderboard: leaderboard.leaderboardId });
                onLeaderboardIdSelected(leaderboard);
            }}
            style={{ width: 150 }}
        />
    );
}
