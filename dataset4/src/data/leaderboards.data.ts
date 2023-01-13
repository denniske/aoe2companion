
export const abbreviationsData = {
    0: 'custom',
    17: '1v1',
    18: '2v2',
    19: '3v3',
    20: '4v4',
    1001: 'e1v1',
    1002: 'esolo',
    1003: 'eteam',
};

export const leaderboardMappingData: any = {
    1002: {
        title: 'RM',
        subtitle: 'Solo',
    },
    1003: {
        title: 'RM',
        subtitle: 'Team',
    },
    17: {
        title: 'QM',
        subtitle: '1v1',
    },
    18: {
        title: 'QM',
        subtitle: '2v2',
    },
    19: {
        title: 'QM',
        subtitle: '3v3',
    },
    20: {
        title: 'QM',
        subtitle: '4v4',
    },
    // 0: {
    //     title: 'CUS',
    //     subtitle: 'Custom',
    // },
};

export const leaderboardIdsData = [1002, 1003, 17, 18, 19, 20];
// export const leaderboardIdsData = [1001, 17, 18, 19, 20, 0];
// export const leaderboardIdsData = Object.keys(leaderboardMappingData) as any as number[];
