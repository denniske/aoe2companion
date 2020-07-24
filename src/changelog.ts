
export interface IChange {
    type: 'feature' | 'bugfix' | 'minor';
    title: string;
    content?: string;
}

export interface IChangelog {
    [version: string]: IChange[];
}

export const changelog: IChangelog = {
    '12.0.7': [
        {
            type: 'minor',
            title: 'Added supporter list to about page.',
        },
        {
            type: 'minor',
            title: 'Updated map images.',
        },
    ],
    '12.0.6': [
        {
            type: 'bugfix',
            title: 'Fix drop rate calculation.',
        },
    ],
    '12.0.5': [
        {
            type: 'minor',
            title: 'Transparent units/tech images for light mode.',
        },
    ],
    '12.0.3': [
        {
            type: 'bugfix',
            title: 'Fix footer popup menu for dark mode.',
        },
    ],
    '12.0.2': [
        {
            type: 'bugfix',
            title: 'Fix leaderboard.',
        },
    ],
    '12.0.1': [
        {
            type: 'minor',
            title: 'Added help and support links to footer popup menu. Add icons to popup menu.',
        },
        {
            type: 'bugfix',
            title: '"App updated..." notification only shows up once.',
        },
    ],
    '12.0.0': [
        {
            type: 'feature',
            title: 'Changelog',
            content: 'The changelog shows new features and bugfixes after each release.',
        },
        {
            type: 'minor',
            title: 'Added "my rank" to leaderboard',
        },
        {
            type: 'bugfix',
            title: 'Leaderboard does not fail if few entries are displayed.',
        },
        {
            type: 'bugfix',
            title: 'Startup screen is now "me" page again.',
        },
    ],
    '11.0.5': [
        {
            type: 'feature',
            title: 'Country Leaderboard',
            content: 'The leaderboard page can now show leaderboard for every country.',
        },
    ],
    '11.0.0': [
        {
            type: 'feature',
            title: 'System-based dark mode',
            content: 'Added option to change dark mode based on device settings.',
        },
        {
            type: 'bugfix',
            title: 'Fix status bar color in dark mode',
        },
    ],
    '10.0.6': [
        {
            type: 'feature',
            title: 'Statistics filtering',
            content: 'Added statistics filtering by leaderboard (RM 1v1, RM Team, DM 1v1, DM Team, Unranked)',
        },
        {
            type: 'feature',
            title: 'Dark Mode',
            content: 'Added dark mode (see settings)',
        },
    ],
    '10.0.4': [
        {
            type: 'feature',
            title: 'Update Bar',
            content: 'Check for updates on startup and show update bar if update is available.',
        },
    ],
    '10.0.3': [
        {
            type: 'minor',
            title: 'Added cost, training time and many other information on unit page',
        },
        {
            type: 'minor',
            title: 'Added cost, research time on tech page',
        },
        {
            type: 'minor',
            title: 'Added Parthian Tactics to tech tree',
        },
    ],
    '10.0.2': [
        {
            type: 'minor',
            title: 'Added Steppe Lancer, Battle Elephant and Eagle line to tech tree',
        },
        {
            type: 'minor',
            title: 'Fixed Indians civ page',
        },
    ],
};
