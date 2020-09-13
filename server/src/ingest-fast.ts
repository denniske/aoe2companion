import {createDB} from "./helper/db";
import {fetchLeaderboardRecentMatches} from "../../serverless/src/helper";
import {LeaderboardRow} from "../../serverless/entity/leaderboard-row";
import {upsertLeaderboardRows} from "../../serverless/entity/entity-helper";
import {createExpress} from "./helper/express";


const app = createExpress();

async function refetchMatchesSinceLastTime() {
    const connection = await createDB();

    // console.log(new Date(), "Refetch leaderboard recent matches");
    //
    // const recentLeaderboardRows = await prisma.leaderboard_row.findMany({
    //     orderBy: { last_match_time: 'desc' },
    //     take: 1,
    // });
    //
    // if (recentLeaderboardRows.length != 1) throw "???";
    //
    // const lastMatchTime = recentLeaderboardRows[0].last_match_time;

    console.log(new Date(), "Fetch leaderboard recent matches now");
    let entries = await fetchLeaderboardRecentMatches(50);
    console.log(new Date(), 'GOT', entries.data.length);

    // "",
    // "2109913",
    // "31079",
    // "837",
    // "822",
    // "",
    // "Arkmes",
    // "/assets/images/xbox.png",
    // "/assets/images/xboxfull.png",
    // "/assets/images/xboxmedium.png",
    // "218",
    // "1",
    // "106",
    // "49",
    // "19",
    // "9",
    // 31079,
    // 31,
    // 4,
    // 3,
    // true,
    // 1598830554

    const leaderboardRows = entries.data.map(d => ({
        leaderboard_id: 3,
        steam_id: d[0],
        profile_id: parseInt(d[1]),
        rank: parseInt(d[2]),
        rating: parseInt(d[3]),
        previous_rating: parseInt(d[4]),
        country: d[5],
        name: d[6],
        // x1: d[7], profile
        // x2: d[8], profilefull
        // x3: d[9], profilemedium
        games: parseInt(d[10]),
        streak: parseInt(d[11]),
        wins: parseInt(d[12]),
        finished: d[13],
        drops: parseInt(d[14]),
        longest_streak: d[15],
        // rank: d[16],
        // y1: d[17],
        // y2: d[18],
        // y3: d[19],
        // y4: d[20],
        last_match_time: d[21],
    } as LeaderboardRow));

    if (leaderboardRows.length > 0) {
        console.log(leaderboardRows[0].last_match_time, '-', leaderboardRows[leaderboardRows.length-1].last_match_time);

        await upsertLeaderboardRows(connection, leaderboardRows);
    } else {
        console.log('No elements');
    }

    return false;
}

async function refetchMatches() {
    try {
        const matchesProcessed = await refetchMatchesSinceLastTime();
        if (matchesProcessed) {
            console.log('Waiting 0s');
            setTimeout(refetchMatches, 0 * 1000);
        } else {
            console.log('Waiting 30s');
            setTimeout(refetchMatches, 30 * 1000);
        }
    } catch (e) {
        console.error(e);
        setTimeout(refetchMatches, 60 * 1000);
    }
}

async function main() {
    await createDB();
    app.listen(process.env.PORT || 3003, () => console.log(`Server listening on port ${process.env.PORT || 3003}!`));
    await refetchMatches();
}

main();
