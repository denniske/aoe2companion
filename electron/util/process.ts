import {spawn} from "child_process";

export async function spawnDetached(exe: string, args: Array<string>): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            const process = spawn(exe, args, {
                detached: true,
                stdio: "ignore",
            })
            process.on("error", error => {
                reject(error)
            })
            process.unref()

            if (process.pid !== undefined) {
                resolve(true)
            }
        }
        catch (error) {
            reject(error)
        }
    })
}
