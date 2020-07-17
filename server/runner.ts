import {hello3} from "./src/handler";
import {leaderboard} from "./src/leaderboard";

async function run() {
    const result: any = await leaderboard(null, null, null);
    // const result: any = await hello3(null, null, null);
    console.log(JSON.parse(result.body));
}

run();

