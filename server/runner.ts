import {hello3} from "./handler";

async function run() {
    const result: any = await hello3(null, null, null);
    console.log(JSON.parse(result.body));
}

run();

