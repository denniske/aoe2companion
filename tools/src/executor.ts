import * as fs from "fs"
import * as path from "path"

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function executeMgz(port: number) {
    // noinspection InfiniteLoopJS
    while (true) {
        const response = await fetch(`http://195.201.24.178:${port}/won?match_id=30791021`);
        // const response = await fetch(`http://localhost:${port}/won?match_id=30791021`);
        const json = await response.json();
        console.log(json);
    }
}

async function executeParallelMgz() {
    const ports = [80, 80];
    // const ports = [80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95];
    // const ports = [80, 81, 82, 83, 84, 85, 86, 87, 88, 89];
    for (const port of ports) {
        console.log("Mgz on port " + port);
        executeMgz(port);
    }
}

executeParallelMgz();
