
export interface IChange {
    type: 'feature' | 'bugfix' | 'minor';
    title: string;
    content?: string;
}

export interface IChangelog {
    [version: string]: IChange[];
}

// https://www.aoe2insights.com/match/99919072/analysis/

export const changelog4: IChangelog = {
    '3.0.1': [
        {
            type: 'bugfix',
            title: 'Fix Holy Roman Empire influence description',
        },
    ],
    '3.0.0': [
        {
            type: 'feature',
            title: 'Follow players',
        },
        {
            type: 'feature',
            title: 'Leaderboard',
        },
        {
            type: 'feature',
            title: 'Civilization Overview',
        },
    ],
};

export const changelog: IChangelog = {
    '36.0.1': [
        {
            type: 'bugfix',
            title: 'Fix mountain range map image',
        },
    ],
    '36.0.0': [
        {
            type: 'minor',
            title: 'Internal Framework Update (Expo Eas)',
        },
    ],
    '28.0.0': [
        {
            type: 'minor',
            title: 'Internal Framework Update (Expo SDK 43)',
        },
    ],
    '26.0.22': [
        {
            type: 'minor',
            title: 'Add Xolotl Warrior to tech tree',
        },
    ],
    '26.0.21': [
        {
            type: 'minor',
            title: 'List affected units/buildings of age upgrades in tech details',
        },
    ],
    '26.0.20': [
        {
            type: 'minor',
            title: 'Add more age upgrades to unit/building details',
        },
    ],
    '26.0.19': [
        {
            type: 'minor',
            title: 'Add age upgrades to unit/building details',
        },
        {
            type: 'bugfix',
            title: 'Minor unit/tech fixes',
        },
        {
            type: 'bugfix',
            title: 'Fix crash when viewing verified player profile',
        },
    ],
    '26.0.18': [
        {
            type: 'feature',
            title: 'Fetch up-to-date verified player list',
        },
    ],
    '26.0.17': [
        {
            type: 'bugfix',
            title: 'Fix Manipur Cavalry and Chatras description',
        },
    ],
    '26.0.16': [
        {
            type: 'bugfix',
            title: 'Remove Manipur Cavalry from Arambai',
        },
    ],
    '26.0.15': [
        {
            type: 'minor',
            title: 'Implemented [AoE II DE Update 56005](https://www.ageofempires.com/news/aoeii_de_update_56005/)',
        },
    ],
    '26.0.14': [
        {
            type: 'minor',
            title: 'Implemented [AoE II DE Update 54480](https://www.ageofempires.com/news/aoeii-de-update-54480/)',
        },
    ],
    '26.0.13': [
        {
            type: 'bugfix',
            title: 'Fix civ mapping again (britons were sometimes shown as bohemians)',
        },
    ],
    '26.0.12': [
        {
            type: 'bugfix',
            title: 'Add sicilians unique tech hauberk. Fix effect of Howdah tech.',
        },
    ],
    '26.0.11': [
        {
            type: 'bugfix',
            title: 'Fix bohemian unique unit pages',
        },
        {
            type: 'bugfix',
            title: 'Fix civ mapping according to aoe2.net changes',
        },
    ],
    '26.0.10': [
        {
            type: 'minor',
            title: 'Implemented [AoE II DE Update 51737](https://www.ageofempires.com/news/aoeiide-update-51737/)',
        },
    ],
    '26.0.9': [
        {
            type: 'bugfix',
            title: 'Fix missing ally/position stats for Empire Wars',
        },
    ],
    '26.0.8': [
        {
            type: 'minor',
            title: 'Implemented remaining parts from [AoE II DE Update 50292](https://www.ageofempires.com/news/aoe2de-update-50292/) (balance changes)',
        },
        {
            type: 'bugfix',
            title: 'Fix affected unit list of the Italian castle age tech Pavise',
        },
    ],
    '26.0.7': [
        {
            type: 'minor',
            title: 'Implemented [AoE II DE Update 50292](https://www.ageofempires.com/news/aoe2de-update-50292/) partially (maps, leaderboards)',
        },
        {
            type: 'bugfix',
            title: 'Fix search for players with digits in name',
        },
    ],
    '26.0.6': [
        {
            type: 'minor',
            title: 'Added user search by steam id and profile id',
        },
    ],
    '26.0.5': [
        {
            type: 'minor',
            title: 'Add new maps',
        },
    ],
    '26.0.4+0': [
        {
            type: 'minor',
            title: 'Refresh profile/stats/matches by pressing F5',
        },
    ],
    '26.0.4': [
        {
            type: 'minor',
            title: 'Show ingame duration instead real time duration in match info',
        },
    ],
    '26.0.3': [
        {
            type: 'minor',
            title: 'Implement [AoE II DE Update 47820](https://www.ageofempires.com/news/aoe2de-update-47820/)',
        },
    ],
    '26.0.2+1': [
        {
            type: 'minor',
            title: 'Added quick search for build orders (Control+F, Tab)',
        },
    ],
    '26.0.2+0': [
        {
            type: 'feature',
            title: 'Added hotkey Control+F for quick search units, etc.',
        },
        {
            type: 'bugfix',
            title: 'Fixed transparency issue for overlay again',
        },
    ],
    '26.0.2': [
        {
            type: 'minor',
            title: 'Added charge attack stats for Coustillier',
        },
        {
            type: 'bugfix',
            title: 'Fixed units stats compare section headers',
        },
    ],
    '26.0.1+2': [
        {
            type: 'bugfix',
            title: 'Fix transparency issue with overlay',
        },
    ],
    '26.0.1+0': [
        {
            type: 'feature',
            title: 'Made main window resizable (only height)',
        },
        {
            type: 'feature',
            title: 'Made overlay opacity/offset/duration configurable',
        },
    ],
    '26.0.1': [
        {
            type: 'bugfix',
            title: 'Fixed civ icons in civ list for non-english languages',
        },
        {
            type: 'minor',
            title: 'Improved loading time of changelog page and civ list',
        },
    ],
    '26.0.0+0': [
        {
            type: 'feature',
            title: 'First stable desktop release',
        },
    ],
    '26.0.0': [
        {
            type: 'bugfix',
            title: 'Fixed app crash on startup',
        },
        {
            type: 'bugfix',
            title: 'Fixed activity indicators on android',
        },
        {
            type: 'minor',
            title: 'Improved loading time of civ page',
        },
    ],
    '22.0.8': [
        {
            type: 'bugfix',
            title: 'Fixed a rare bug when displaying user profiles after clicking on push notification',
        },
    ],
    '22.0.7': [
        {
            type: 'minor',
            title: 'Sort civs alphabetically for non english languages',
        },
    ],
    '22.0.6': [
        {
            type: 'bugfix',
            title: 'Fix unit page for some units (Mameluke etc.)',
        },
    ],
    '22.0.5': [
        {
            type: 'minor',
            title: 'Fix victory/defeat icon on following page',
        },
    ],
    '22.0.4': [
        {
            type: 'feature',
            title: 'Increased followed players limit to 75',
        },
        {
            type: 'minor',
            title: 'Show loading indicator while refetching feed',
        },
    ],
    '22.0.3': [
        {
            type: 'feature',
            title: 'Add verified badge for players listed in [aoc-reference-data](https://github.com/SiegeEngineers/aoc-reference-data/blob/master/data/players.yaml)',
        },
        {
            type: 'feature',
            title: 'Add social links for verified players',
        },
        {
            type: 'minor',
            title: 'Add spectate button in feed and download rec button in match details (only web)',
        },
        {
            type: 'minor',
            title: 'Enable push notifications for web version',
        },
    ],
    '22.0.2': [
        {
            type: 'minor',
            title: 'Implement [AoE II DE Hotfix 45185](https://www.ageofempires.com/news/aoe2de-hotfix-45185/)',
        },
    ],
    '22.0.1': [
        {
            type: 'bugfix',
            title: 'Fix some remaining wrong civs for stats and match list',
        },
    ],
    '22.0.0': [
        {
            type: 'bugfix',
            title: 'Fix localization for Simplified Chinese (简体中文)',
        },
    ],
    '21.0.8': [
        {
            type: 'minor',
            title: 'Added upgrades and counters for Lords of the West units',
        },
        {
            type: 'minor',
            title: 'Add "Against Civ" stats for RM 1v1 & DM 1v1 leaderboards',
        },
        {
            type: 'minor',
            title: 'Sort players by team and color in match details',
        },
    ],
    '21.0.7': [
        {
            type: 'minor',
            title: 'Refresh match list when notification was tapped',
        },
        {
            type: 'bugfix',
            title: 'Tech tree: Spanish should not have arbalester',
        },
        {
            type: 'bugfix',
            title: 'Fix flemish militia training time',
        },
    ],
    '21.0.6': [
        {
            type: 'feature',
            title: 'Try to fix civs and match outcome via secondary data source',
        },
        {
            type: 'minor',
            title: 'Group match activity by players',
        },
        {
            type: 'minor',
            title: 'Show match name for unranked matches',
        },
        {
            type: 'minor',
            title: 'Opening push notification will expand match info',
        },
        {
            type: 'minor',
            title: 'Add back button and hardware back press to build order guides',
        },
    ],
    '21.0.5': [
        {
            type: 'bugfix',
            title: 'Fix civ stats',
        },
    ],
    '21.0.4': [
        {
            type: 'bugfix',
            title: 'Fix leaderboard page',
        },
    ],
    '21.0.2': [
        {
            type: 'bugfix',
            title: 'Fix map names in match list',
        },
    ],
    '21.0.1': [
        {
            type: 'bugfix',
            title: 'Fix civ names in match list',
        },
    ],
    '21.0.0': [
        {
            type: 'minor',
            title: 'Implement [AoE II DE Update 44725](https://www.ageofempires.com/news/aoeiide-update-44725/)',
        },
        {
            type: 'minor',
            title: 'Prepare app for localization',
        },
        {
            type: 'bugfix',
            title: 'Some fixes for unit stats',
        },
    ],
    '20.0.1': [
        {
            type: 'bugfix',
            title: 'Fix unit list heading color in dark mode',
        },
        {
            type: 'bugfix',
            title: 'Add Missionary to unit list',
        },
        {
            type: 'bugfix',
            title: 'AI player does not link to profile screen',
        },
    ],
    '20.0.0': [
        {
            type: 'minor',
            title: 'Internal changes',
        },
    ],
    '19.0.3': [
        {
            type: 'bugfix',
            title: 'Fix game type display for Unranked games',
        },
    ],
    '19.0.2': [
        {
            type: 'bugfix',
            title: 'Fix profile page',
        },
    ],
    '19.0.1': [
        {
            type: 'feature',
            title: 'Embed aoestats.io with civ and map winrates',
        },
        {
            type: 'feature',
            title: 'Prevent screen lock on build order page (when activated in settings)',
        },
        {
            type: 'minor',
            title: 'Improved search',
        },
        {
            type: 'minor',
            title: 'Implement [AoE II DE Update 42848](https://www.ageofempires.com/news/aoe2de-update-42848/)',
        },
    ],
    '19.0.0': [
        {
            type: 'minor',
            title: 'Show your country at second position in leaderboard country selector',
        },
    ],
    '18.0.0': [
        {
            type: 'minor',
            title: 'Internal changes',
        },
    ],
    '17.0.0': [
        {
            type: 'minor',
            title: 'Add "< 5 min" match duration to stats',
        },
        {
            type: 'minor',
            title: 'Add more stats (accuracy, min range, etc.) to buildings page',
        },
        {
            type: 'bugfix',
            title: 'Android: Fix grey background color in build order guide',
        },
    ],
    '16.0.1': [
        {
            type: 'feature',
            title: 'Add stats (hit points, attack, etc.) to buildings page',
        },
        {
            type: 'minor',
            title: 'Add market to tech tree',
        },
        {
            type: 'bugfix',
            title: 'Fix some issues with push notifications (you might to disable and enable them again)',
        },
    ],
    '16.0.0': [
        {
            type: 'bugfix',
            title: 'App does not crash anymore for iOS 11 and below',
        },
    ],
    '15.0.4': [
        {
            type: 'bugfix',
            title: 'Fix rating history time axis',
        },
    ],
    '15.0.3': [
        {
            type: 'feature',
            title: 'Add stats for match duration',
        },
        {
            type: 'feature',
            title: 'Show match duration in match details',
        },
        {
            type: 'feature',
            title: 'Show unit upgrade cost on unit page',
        },
        {
            type: 'feature',
            title: 'Add 1d (one day) to rating history time selection',
        },
        {
            type: 'minor',
            title: 'Leaderboard hides games count for lower resolution devices',
        },
        {
            type: 'minor',
            title: 'Show result of update availability check',
        },
        {
            type: 'bugfix',
            title: 'Maybe fix guide page for some devices',
        },
        {
            type: 'bugfix',
            title: 'Change push notification text active/inactive',
        },
        {
            type: 'bugfix',
            title: 'Fix width w/ me',
        },
    ],
    '15.0.2': [
        {
            type: 'bugfix',
            title: 'Fix width for player name in leaderboard',
        },
    ],
    '15.0.1': [
        {
            type: 'bugfix',
            title: 'Fix display of game result (won/lost)',
        },
    ],
    '15.0.0': [
        {
            type: 'bugfix',
            title: 'Fix stable units position in full tech tree',
        },
    ],
    '14.0.18': [
        {
            type: 'feature',
            title: 'Show crown/skull for win/loose next to map',
        },
        {
            type: 'minor',
            title: 'Underline relevant players in following page and me/user match list',
        },
        {
            type: 'minor',
            title: 'Prepare for web version',
        },
    ],
    '14.0.17': [
        {
            type: 'bugfix',
            title: 'Fix user stats page',
        },
    ],
    '14.0.16': [
        {
            type: 'feature',
            title: 'Redesign user/me page',
        },
        {
            type: 'feature',
            title: 'Add leaderboard filter & search for user match list',
        },
        {
            type: 'feature',
            title: 'Added "Show more" button in player stats',
        },
        {
            type: 'minor',
            title: 'Added dismounted konnik',
        },
        {
            type: 'bugfix',
            title: 'Fix scout cavalry line upgrades (line of sight, speed, attack)',
        },
    ],
    '14.0.15': [
        {
            type: 'minor',
            title: 'Add time filter for rating history',
        },
        {
            type: 'bugfix',
            title: 'Fix statistics leaderboard picker',
        },
    ],
    '14.0.14': [
        {
            type: 'bugfix',
            title: 'Try to redirect to following page when notification is clicked',
        },
    ],
    '14.0.13': [
        {
            type: 'feature',
            title: 'Add unit comparison on unit page',
        },
        {
            type: 'feature',
            title: 'Add civ availability to unit/tech/building page',
        },
        {
            type: 'feature',
            title: 'Add affected units to tech page',
        },
        {
            type: 'feature',
            title: 'Add steam/xbox profile links to user page',
        },
        {
            type: 'minor',
            title: 'Added more tips & tricks',
        },
        {
            type: 'bugfix',
            title: 'Add hand cannoneer and slinger to unit list',
        },
        {
            type: 'bugfix',
            title: 'Fixed unit/tech links in civ description and bonus list',
        },
        {
            type: 'bugfix',
            title: 'Leaderboard page now has correctly sized rank column',
        },
    ],
    '14.0.12': [
        {
            type: 'minor',
            title: 'Click on my rank at the top of the leaderboard scrolls to my rank in the leaderboard',
        },
        {
            type: 'bugfix',
            title: 'Feed page does not show error when no players are being followed',
        },
    ],
    '14.0.11': [
        {
            type: 'bugfix',
            title: 'Me page is start page again',
        },
    ],
    '14.0.10': [
        {
            type: 'minor',
            title: 'Added scroll handle (circle on the right) to leaderboard',
        },
        // {
        //     type: 'bugfix',
        //     title: 'Open Following Page when push notification is clicked',
        // },
    ],
    '14.0.9': [
        {
            type: 'feature',
            title: 'Tips & Tricks',
        },
    ],
    '14.0.8': [
        {
            type: 'minor',
            title: 'Change default dark mode to system',
        },
        {
            type: 'bugfix',
            title: 'Show AI in match player list',
        },
        {
            type: 'bugfix',
            title: 'Filtering of unique unit counters for both weak vs. / strong vs.',
        },
        {
            type: 'bugfix',
            title: 'Fix fetching more player matches',
        },
    ],
    '14.0.7': [
        {
            type: 'bugfix',
            title: 'Fix civ/unit/tech/building screens',
        },
    ],
    '14.0.6': [
        {
            type: 'bugfix',
            title: 'Fixed storage of settings',
        },
    ],
    '14.0.5': [
        {
            type: 'feature',
            title: 'Push Notifications when followed player starts match (see settings)',
        },
        {
            type: 'feature',
            title: 'Increased followed players limit to 30',
        },
        {
            type: 'minor',
            title: 'Faster following page',
        },
        {
            type: 'bugfix',
            title: 'Try to fix country selector width',
        },
    ],
    '14.0.4': [
        {
            type: 'bugfix',
            title: 'Fixed country selector',
        },
    ],
    '14.0.3': [
        {
            type: 'feature',
            title: 'Add unique unit counters',
        },
    ],
    '14.0.2': [
        {
            type: 'bugfix',
            title: 'Try to fix country selector',
        },
    ],
    '14.0.0': [
        {
            type: 'minor',
            title: 'Prepare push notifications',
        },
    ],
    '13.0.0': [
        {
            type: 'minor',
            title: 'More info in user profile',
        },
    ],
    '12.0.14': [
        {
            type: 'minor',
            title: 'Prepare push notifications',
        },
    ],
    '12.0.13': [
        {
            type: 'bugfix',
            title: 'Lobby Browser now removes lobbies correctly',
        },
    ],
    '12.0.12': [
        {
            type: 'feature',
            title: 'Lobby Browser',
        },
    ],
    '12.0.11': [
        {
            type: 'bugfix',
            title: 'Bulgarian now have krepost in tech tree',
        },
        {
            type: 'bugfix',
            title: 'Show more armour classes for units',
        },
    ],
    '12.0.10': [
        {
            type: 'feature',
            title: 'Full tech tree on civ page',
        },
        {
            type: 'feature',
            title: 'Added buildings screen',
        },
        {
            type: 'minor',
            title: 'Sort unique units alphabetically',
        },
        {
            type: 'bugfix',
            title: 'Fixed unit list linking',
        },
    ],
    '12.0.9': [
        {
            type: 'minor',
            title: 'Implement [AoE II DE Update 39284](https://www.ageofempires.com/news/aoe2de-update-39284/)',
        },
        {
            type: 'minor',
            title: 'Techs/Units are now sorted into categories',
        },
        {
            type: 'bugfix',
            title: 'Tech/Unit search is not case sensitive anymore.',
        },
    ],
    '12.0.8': [
        {
            type: 'feature',
            title: 'Added pocket/flank position stats.',
        },
        {
            type: 'feature',
            title: 'Added ability to search for techs and units.',
        },
    ],
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
