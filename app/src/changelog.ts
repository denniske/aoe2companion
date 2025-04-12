import { openLink } from './helper/url';
import { MyText } from './view/components/my-text';
import React from 'react';

export interface IChange {
    type: 'feature' | 'bugfix' | 'minor';
    title: string;
    content?: string;
    author?: string;
}

export interface IChangelog {
    [version: string]: IChange[];
}

// https://www.aoe2insights.com/match/99919072/analysis/

// https://www.ageofempires.com/news/age-of-empires-iv-season-one-update-release-notes/

export const changelog4: IChangelog = {
    '18.0.0': [
        {
            type: 'feature',
            title: 'Implemented [Knights of Cross and Rose Expansion](https://www.ageofempires.com/news/age-of-empires-iv-knights-of-cross-and-rose-available-now/)',
        },
    ],
    '17.0.0': [
        {
            type: 'feature',
            title: 'Show showmatches in Pro tab',
        },
        {
            type: 'feature',
            title: 'Choose main page (the page that is shown when the app is opened) in settings (iOS, Android)',
        },
        {
            type: 'bugfix',
            title: 'Fixed Pull-To-Refresh for matches list, etc. (Android)',
        },
        {
            type: 'bugfix',
            title: 'Fixed push notifications',
        },
    ],
    '16.0.0': [
        {
            type: 'feature',
            title: 'New App Design',
            author: '[Noah Brandyberry](https://github.com/noahbrandyberry)',
        },
        {
            type: 'feature',
            title: 'Added new "Pros" tab',
        },
    ],
    '14.0.0': [
        {
            type: 'feature',
            title: 'Using new backend. Moved some calculations to the server for better performance. Some features likes searching for maps and match names in match list are not ready yet and have been disabled for now. I will check if historical data can be imported. For more information and roadmap see [Discord](https://discord.gg/gCunWKx)',
        },
        {
            type: 'feature',
            title: 'Implemented [AoE IV Update 9.1.109](https://www.ageofempires.com/news/age-of-empires-iv-update-9-1-109/)',
        },
        {
            type: 'feature',
            title: 'Implemented [The Sultans Ascend Expansion](https://www.ageofempires.com/news/the-sultans-ascend-everything-in-the-expansion/)',
        },
        {
            type: 'feature',
            title: 'Now also showing console matches',
        },
        {
            type: 'feature',
            title: 'Lobbies page (Three dots > Lobbies)',
        },
        {
            type: 'bugfix',
            title: 'Fix navigation to civ page from matches/stats',
        },
        {
            type: 'bugfix',
            title: 'Fixed navigation to twitch channel from feed page',
        },
    ],
    '12.0.0': [
        {
            type: 'minor',
            title: 'Internal Framework Update (SDK 49)',
        },
    ],
    '11.0.0': [
        {
            type: 'bugfix',
            title: 'Fix leaderboard names/colors',
        },
    ],
    '10.0.0': [
        {
            type: 'bugfix',
            title: 'Fix profile page not loading for some players',
        },
    ],
    '9.0.0': [
        {
            type: 'minor',
            title: 'Added some maps',
        },
    ],
    '8.0.0': [
        {
            type: 'minor',
            title: 'Add malians / ottomans',
        },
        {
            type: 'minor',
            title: 'Add RM Solo / Team leaderboards',
        },
    ],
    '6.0.0': [
        {
            type: 'minor',
            title: 'Use emoji flags',
        },
        {
            type: 'bugfix',
            title: 'Fix profile page not loading',
        },
        {
            type: 'bugfix',
            title: 'Fix stats page not loading',
        },
    ],
    '5.0.4': [
        {
            type: 'bugfix',
            title: 'Fix profile page crashing',
        },
    ],
    '5.0.3': [
        {
            type: 'feature',
            title: 'Use aoe4world.com api instead aoeiv.net api',
        },
        {
            type: 'feature',
            title: 'Implemented [AoE IV Season One Update](https://www.ageofempires.com/news/age-of-empires-iv-season-one-update-release-notes/)',
        },
        {
            type: 'bugfix',
            title: 'Fix stats page',
        },
    ],
    '5.0.1': [
        {
            type: 'bugfix',
            title: 'Fix profile page not loading',
        },
    ],
    '5.0.0': [
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
    '122.0.0': [
        {
            type: 'bugfix',
            title: 'Fix toggle following (heart icon) on player page',
        },
        {
            type: 'bugfix',
            title: 'Fix missing quick play matches on player matches tab',
        },
        {
            type: 'bugfix',
            title: 'Fix crash on stats > winrates > civ page',
        },
        {
            type: 'minor',
            title: 'Redesigned profile page header',
        },
        {
            type: 'feature',
            title: 'Account creation',
            content: 'You can now create an account to save your settings and followed players across devices',
        },
        {
            type: 'feature',
            title: 'Link steam account',
            content: 'Link your Steam account to prove ownership of your profile'
        },
        {
            type: 'feature',
            title: 'Link patreon account',
            content: 'Link your Patreon account to access exclusive benefits'
        },
    ],
    '121.0.0': [
        {
            type: 'bugfix',
            title: 'Fix algorithm for matching players to verified players',
        },
        {
            type: 'bugfix',
            title: 'Mark Steppe Lancer as not unique',
        },
        {
            type: 'bugfix',
            title: 'Remove elite units from unit list (except for skirmisher and eagle warrior)',
        },
        {
            type: 'bugfix',
            title: 'On Unit page show elite upgrades for more units',
        },
    ],
    '120.0.0': [
        {
            type: 'minor',
            title: 'Profile page chart rendering performance improvements',
        },
        {
            type: 'bugfix',
            title: 'Navigate to home page when there is no other page to go back (android)',
        },
        {
            type: 'bugfix',
            title: 'Pressing the home page button in the navigation footer should navigate to home page (not start page)',
        },
    ],
    '119.0.0': [
        {
            type: 'feature',
            title: 'Steam Family Sharing Indicator',
            content: 'Show family icon next to player in match popup and on profile',
        },
        {
            type: 'minor',
            title: '[AoE II DE Update 128442](https://www.ageofempires.com/news/age-of-empires-ii-definitive-edition-update-128442/)',
            content: 'There were no changes applied in this update',
        },
        {
            type: 'minor',
            title: 'Fixed some changes from previous AoE II DE Updates and updated translations',
        },
        {
            type: 'minor',
            title: 'Internal Framework Update (SDK 52)',
        },
        {
            type: 'bugfix',
            title: 'Fix header on profile page showing wrong icons',
        },
        {
            type: 'bugfix',
            title: 'Fix tournament page crash when tournament schedule dates are invalid',
        },
        {
            type: 'bugfix',
            title: 'Fix leaderboard page crash when leaderboard is changed (iOS)',
        },
    ],
    '116.0.0': [
        {
            type: 'minor',
            title: 'Check for update in play store / app store',
            content: 'Check for update on startup and show a popup if an update is available',
        },
    ],
    '115.0.0': [
        {
            type: 'bugfix',
            title: 'Fix house and palisade wall pages',
        },
    ],
    '114.0.0': [
        {
            type: 'minor',
            title: 'Implemented [AoE II DE Update 125283](https://www.ageofempires.com/news/age-of-empires-ii-definitive-edition-update-preview-125283/)',
        },
        {
            type: 'bugfix',
            title: 'Fix \'Find Player\' button on home page (web)',
        },
    ],
    '111.0.0': [
        {
            type: 'feature',
            title: 'Integrated with [aoestats.io](https://aoestats.io) to add new Stats > Winrates screen',
        },
        {
            type: 'minor',
            title: 'Cleanup competitive players tournament games',
        },
        {
            type: 'bugfix',
            title: 'Fixed some group stages not showing up',
        },
    ],
    '110.0.0': [
        {
            type: 'feature',
            title: 'Show showmatches in Pro tab',
        },
        {
            type: 'feature',
            title: 'Choose main page (the page that is shown when the app is opened) in settings (iOS, Android)',
        },
    ],
    '109.0.0': [
        {
            type: 'bugfix',
            title: 'Fixed Counterweights to have Saracen icon',
        },
        {
            type: 'bugfix',
            title: 'Fixed Pull-To-Refresh for matches list, etc. (Android)',
        },
    ],
    '108.0.0': [
        {
            type: 'bugfix',
            title: 'Fixed push notifications',
        },
    ],
    '105.0.0': [
        {
            type: 'minor',
            title: 'Internal Framework Update (SDK 51)',
        },
        {
            type: 'minor',
            title: 'Removed outdated win rates page and made leaderboard accessible directly from the footer',
        },
        {
            type: 'minor',
            title: 'The source on each unit/building/tech page now links to the fandom page directly',
        },
        {
            type: 'bugfix',
            title: 'The search on the explore page now uses translated names',
        },
        {
            type: 'bugfix',
            title: 'Fixed Yeomen attack bonus for tower',
        },
        {
            type: 'bugfix',
            title: 'Thumb Ring bonus is now being correctly nullified for Slingers',
        },
    ],
    '101.0.0': [
        {
            type: 'minor',
            title: 'Small fix for app guidelines (iOS)',
        },
    ],
    '100.0.0': [
        {
            type: 'minor',
            title: 'Implemented [AoE II DE Update 111772](https://www.ageofempires.com/news/age-of-empires-ii-definitive-edition-update-111772/)',
        },
        {
            type: 'minor',
            title: 'Added PC/Xbox filter to Leaderboards',
        },
        {
            type: 'bugfix',
            title: 'Re-added "Find Player" functionality',
        },
        {
            type: 'bugfix',
            title: 'Cleaned up tournament details to account for upcoming tournaments with TBD information',
        },
    ],
    '97.0.0': [
        {
            type: 'minor',
            title: 'Reworked "Pros" tab',
        },
        {
            type: 'minor',
            title: 'Reworked tournament screen',
        },
        {
            type: 'minor',
            title: 'Remove Tracking tech and add implicit tracking line of sight bonus to unit stats directly',
        },
        {
            type: 'bugfix',
            title: 'Fix attack bonus for Manipur Cavalry',
        },
        {
            type: 'bugfix',
            title: 'Add Ballistics and Siege Engineers for Turtle Ship',
        },
    ],
    '96.0.0': [
        {
            type: 'bugfix',
            title: 'Fix leaderboard mixup when changing country',
        },
        {
            type: 'bugfix',
            title: 'Fix leaderboard display (quick play / ranked) in match list',
        },
        {
            type: 'bugfix',
            title: 'Show win/loose for match list again',
        },
        {
            type: 'bugfix',
            title: 'Click on notification for new match opens match details correctly',
        },
        {
            type: 'bugfix',
            title: 'Show research time for military upgrades like Man-at-Arms',
        },
        {
            type: 'bugfix',
            title: 'Fix number of games display for followed players on home screen',
        },
        {
            type: 'bugfix',
            title: 'Fix back button (Android)',
        },
    ],
    '94.0.0': [
        {
            type: 'feature',
            title: 'New App Design',
            author: '[Noah Brandyberry](https://github.com/noahbrandyberry)',
        },
        {
            type: 'minor',
            title: 'Implemented [AoE II DE Update 107882](https://www.ageofempires.com/news/age-of-empires-ii-definitive-edition-update-107882/)',
        },
    ],
    '90.0.0': [
        {
            type: 'bugfix',
            title: 'Fix error in leaderboard for followed players',
        },
    ],
    '89.0.0': [
        {
            type: 'bugfix',
            title: 'Fix scrolling in build page filter boxes for android',
        },
        {
            type: 'bugfix',
            title: 'Fix scrolling to your rank on country leaderboard',
        },
    ],
    '86.0.0': [
        {
            type: 'bugfix',
            title: 'Fix navigation to player profiles from leaderboard page',
        },
        {
            type: 'minor',
            title: 'Use self-hosted server for OTA (over-the-air) updates',
        },
        {
            type: 'minor',
            title: 'Internal Framework Update (SDK 50)',
        },
    ],
    '79.0.0': [
        {
            type: 'feature',
            title: 'Filter leaderboard by followed players',
            content: 'On leaderboard page choose "Following" in the dropdown. This will show the rating of all players that you are following',
        },
        {
            type: 'feature',
            title: 'Filter leaderboard by clan',
            content:
                'On leaderboard page choose "Clan:..." in the dropdown. This will show the rating of all players of your clan. Note that filtering by any clan is not possible yet. Only your clan is supported. If are not in a clan, this option will not be shown.',
        },
        {
            type: 'minor',
            title: 'Clicking on player name in "Manage Follows" opens the player\'s profile',
        },
        {
            type: 'minor',
            title: 'Selected leaderboards in rating history are saved for your profile',
        },
        {
            type: 'bugfix',
            title: 'Fix building compare list section titles',
        },
        {
            type: 'bugfix',
            title: 'Remove ‹i› from building description',
        },
        {
            type: 'bugfix',
            title: 'Add fereters bonus to Condottiero',
        },
        {
            type: 'bugfix',
            title: 'Only show your rank in leaderboard if you are in the leaderboard',
        },
    ],
    '78.0.0': [
        {
            type: 'feature',
            title: 'Tournaments Page',
            content: 'Go to ⋮ > Tournaments to see ongoing and upcoming tournaments from liquipedia',
            author: '[Noah Brandyberry](https://github.com/noahbrandyberry)',
        },
        {
            type: 'bugfix',
            title: 'Fix effect of Stronghold tech on units',
        },
    ],
    '77.0.0': [
        {
            type: 'feature',
            title: 'Live activity for ongoing matches (iOS)',
            content: 'Go to ⋮ > Ongoing and select one of the ongoing matches to see live activity',
            author: '[Noah Brandyberry](https://github.com/noahbrandyberry)',
        },
        {
            type: 'feature',
            title: 'Build orders widget (iOS)',
            content: 'Add this widget to your home screen for quick access to the build orders you marked as favourite',
            author: '[Noah Brandyberry](https://github.com/noahbrandyberry)',
        },
        {
            type: 'minor',
            title: 'Add list view to build orders page',
        },
        {
            type: 'bugfix',
            title: 'Fix empty steps on build orders page',
        },
    ],
    '76.0.0': [
        {
            type: 'bugfix',
            title: 'Fix tech tree building/unit/tech availability',
        },
        {
            type: 'bugfix',
            title: 'Prevent screen lock on build orders page',
        },
    ],
    '75.0.0': [
        {
            type: 'minor',
            title: 'Implemented [AoE II DE Update 99311](https://www.ageofempires.com/news/age-of-empires-ii-definitive-edition-update-99311/)',
        },
        {
            type: 'bugfix',
            title: 'Fix wrong unit/building/tech icons in android',
        },
    ],
    '74.0.0': [
        {
            type: 'feature',
            title: 'New build order guide page',
            author: '[Noah Brandyberry](https://github.com/noahbrandyberry)',
        },
        {
            type: 'feature',
            title: 'Add w/me filter on another player matches tab',
        },
        {
            type: 'feature',
            title: 'Show upgrade cost of unit at the top of the unit details page',
        },
        {
            type: 'bugfix',
            title: 'Add Gambesons upgrade to Militia line',
        },
        {
            type: 'bugfix',
            title: 'Bagains upgrade only affects Two Handed Swordsman',
        },
        {
            type: 'bugfix',
            title: 'Fix some age upgrades and always show age icon on unit page',
        },
        {
            type: 'bugfix',
            title: 'Prevent following page crash when unfollowing players',
        },
    ],
    '69.0.0': [
        {
            type: 'bugfix',
            title: 'Fix leaderboard loading of players rank 100 and greater',
        },
    ],
    '68.0.7': [
        {
            type: 'bugfix',
            title: 'Fix earlier militia upgrades for Armenians in tech tree',
        },
    ],
    '68.0.6': [
        {
            type: 'bugfix',
            title: 'Fix earlier eco upgrades for Burgundians in tech tree',
        },
    ],
    '68.0.5': [
        {
            type: 'minor',
            title: 'Implemented [AoE II DE Update 95810](https://www.ageofempires.com/news/preview-age-of-empires-ii-definitive-edition-update-95810/)',
        },
        {
            type: 'minor',
            title: 'Add tech upgrade list for buildings',
        },
        {
            type: 'bugfix',
            title: 'Fix affected units list for some techs',
        },
        {
            type: 'bugfix',
            title: 'Fix navigation to civ page from matches/stats',
        },
    ],
    '68.0.3': [
        {
            type: 'bugfix',
            title: 'Fix crash in lobbies page',
        },
        {
            type: 'bugfix',
            title: 'Fix player count in leaderboard page',
        },
    ],
    '68.0.2': [
        {
            type: 'bugfix',
            title: 'Show win/loss for match list again',
        },
    ],
    '68.0.0': [
        {
            type: 'feature',
            title: 'Moved some calculations to the server for better performance. Some features likes searching for maps and match names in match list are not ready yet and have been disabled for now. For more information and roadmap see [Discord](https://discord.gg/gCunWKx)',
        },
        {
            type: 'bugfix',
            title: 'Added Gambesons to tech list',
        },
        {
            type: 'minor',
            title: 'Implemented [AoE II DE Update 93001](https://www.ageofempires.com/news/age-of-empires-ii-definitive-edition-update-93001/)',
        },
    ],
    '64.0.0': [
        {
            type: 'minor',
            title: 'Better support for new maps and scenario/custom maps',
        },
    ],
    '63.0.0': [
        {
            type: 'minor',
            title: 'Implemented [AoE II DE Update 90260](https://www.ageofempires.com/news/age-of-empires-ii-definitive-edition-update-90260/)',
        },
    ],
    '62.0.0': [
        {
            type: 'minor',
            title: 'Limit last matches / stats to 500 to improve performance',
        },
        {
            type: 'bugfix',
            title: 'Shatagni gives +2 range to hand cannoneers',
        },
    ],
    '61.0.0': [
        {
            type: 'minor',
            title: 'Implemented [AoE II DE Update 87863](https://www.ageofempires.com/news/age-of-empires-ii-definitive-edition-update-87863/)',
        },
    ],
    '60.0.0': [
        {
            type: 'minor',
            title: 'Implemented [AoE II DE Hotfix 85208](https://www.ageofempires.com/news/age-of-empires-ii-definitive-edition-hotfix-85208/)',
        },
    ],
    '59.0.0': [
        {
            type: 'bugfix',
            title: 'Flemish Militia moved to Barracks in tech tree',
        },
        {
            type: 'bugfix',
            title: 'Unknown maps not shown as Kilimandscharo anymore',
        },
    ],
    '57.0.0': [
        {
            type: 'minor',
            title: 'Implemented [AoE II DE Update 83607](https://www.ageofempires.com/news/age-of-empires-ii-definitive-edition-update-83607/)',
        },
    ],
    '56.0.0': [
        {
            type: 'minor',
            title: 'Implemented [AoE II DE Hotfix 82587](https://www.ageofempires.com/news/age-of-empires-ii-definitive-edition-hotfix-82587/)',
        },
        {
            type: 'minor',
            title: 'Implemented [AoE II DE Update 81058](https://www.ageofempires.com/news/age-of-empires-ii-definitive-edition-update-81058/)',
        },
    ],
    '55.0.0': [
        {
            type: 'minor',
            title: 'Implemented [AoE II DE Update 78174](https://www.ageofempires.com/news/age-of-empires-ii-definitive-edition-update-78174/)',
        },
        {
            type: 'minor',
            title: 'Implemented [AoE II DE Update 73855](https://www.ageofempires.com/news/age-of-empires-ii-definitive-edition-update-73855/)',
        },
    ],
    '54.0.0': [
        {
            type: 'minor',
            title: 'More detailed error message when network request fails',
        },
        {
            type: 'bugfix',
            title: 'Fix over the air update',
        },
        {
            type: 'bugfix',
            title: 'Fix lobbies page crash',
        },
    ],
    '51.0.0': [
        {
            type: 'bugfix',
            title: 'Fix lobbies page again',
        },
    ],
    '50.0.0': [
        {
            type: 'bugfix',
            title: 'Fix splash screen color',
        },
    ],
    '49.0.0': [
        {
            type: 'bugfix',
            title: 'Fix lobbies page',
        },
        {
            type: 'bugfix',
            title: 'Fix civ linking to another civ page in match history',
        },
    ],
    '48.0.0': [
        {
            type: 'feature',
            title: 'Show rating change in match history',
        },
        {
            type: 'bugfix',
            title: 'Fix cuman tech tree for siege workshop',
        },
    ],
    '47.0.0': [
        {
            type: 'bugfix',
            title: 'Fix civ icons',
        },
        {
            type: 'bugfix',
            title: 'Fix civ stats',
        },
    ],
    '46.0.0': [
        {
            type: 'minor',
            title: 'Search can now also find new players that are not yet in the leaderboards',
        },
        {
            type: 'bugfix',
            title: 'Fix search for players by steam id',
        },
    ],
    '45.0.0': [
        {
            type: 'bugfix',
            title: 'Fix civ mapping for new backend',
        },
        {
            type: 'bugfix',
            title: 'Fix country leaderboard',
        },
    ],
    '44.0.0': [
        {
            type: 'feature',
            title: 'Use new match backend instead of aoe2.net',
        },
    ],
    '43.0.0': [
        {
            type: 'minor',
            title: 'Implemented [AoE II DE Update 66692](https://www.ageofempires.com/news/age-of-empires-ii-definitive-edition-update-66692/)',
        },
    ],
    '42.0.22': [
        {
            type: 'bugfix',
            title: 'Fix serjant creation building names',
        },
    ],
    '42.0.21': [
        {
            type: 'minor',
            title: 'Add search to civ list',
        },
        {
            type: 'bugfix',
            title: 'Fix winged hussar line of sight',
        },
    ],
    '42.0.20': [
        {
            type: 'minor',
            title: 'Use emoji flags',
        },
    ],
    '42.0.1': [
        {
            type: 'bugfix',
            title: 'Fix crash when searching in match list',
        },
        {
            type: 'bugfix',
            title: 'Fix update available message when update is available in play store / app store (by PaitoAnderson)',
        },
    ],
    '42.0.0': [
        {
            type: 'minor',
            title: 'Add harbor to building list and tech tree',
        },
        {
            type: 'bugfix',
            title: 'Add melee attack for ratha',
        },
        {
            type: 'bugfix',
            title: 'Add attack bonus for castle age for eagle scout',
        },
        {
            type: 'bugfix',
            title: 'Fix double bombard tower in korean civ bonus',
        },
        {
            type: 'bugfix',
            title: 'Fix attack speed for stirrups',
        },
    ],
    '41.0.0': [
        {
            type: 'minor',
            title: 'Internal Framework Update (SDK 46)',
        },
    ],
    '40.0.0': [
        {
            type: 'minor',
            title: 'Internal Framework Update (SDK 45)',
        },
    ],
    '39.0.12': [
        {
            type: 'bugfix',
            title: 'Fix verified players badge',
        },
    ],
    '39.0.11': [
        {
            type: 'minor',
            title: 'Show ageofstatistics.com instead aoestats.io on winrates page',
        },
        {
            type: 'bugfix',
            title: 'Add armored/siege elephant to unit list',
        },
    ],
    '39.0.9': [
        {
            type: 'feature',
            title: 'Colorized tech tree',
        },
        {
            type: 'bugfix',
            title: 'Some tech tree fixes',
        },
        {
            type: 'bugfix',
            title: 'Unit stats rounding + charge type',
        },
    ],
    '39.0.8': [
        {
            type: 'minor',
            title: 'Implemented [AoE II DE Update 61321](https://www.ageofempires.com/news/age-of-empires-ii-definitive-edition-update-61321/) (Dynasties of India)',
        },
    ],
    '39.0.7': [
        {
            type: 'minor',
            title: 'Add unique techs to tech list again',
        },
    ],
    '39.0.6': [
        {
            type: 'feature',
            title: 'Mark your favorite build order guides',
        },
    ],
    '39.0.1': [
        {
            type: 'bugfix',
            title: 'Fix expanding match in Lobbies view',
        },
    ],
    '39.0.0': [
        {
            type: 'minor',
            title: 'Click on rating history legend in profile toggles visiblity of the graph',
        },
        {
            type: 'bugfix',
            title: 'Add unique units to units list',
        },
    ],
    '38.0.0': [
        {
            type: 'bugfix',
            title: 'Fix civs for games before Dawn of the Dukes release',
        },
    ],
    '37.0.0': [
        {
            type: 'minor',
            title: 'Internal Framework Update',
        },
    ],
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
