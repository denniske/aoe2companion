import * as functions from 'firebase-functions';

const deleteInactiveGames = async () => {
    console.log();
    console.log("DeleteInactiveGames");
};

// export const deleteInactiveGamesTrigger = functions.https.onRequest(async (req, res) => {
//     await deleteInactiveGames();
//     res.send("OK");
// });

export const deleteInactiveGamesSchedule = functions.region('europe-west1').pubsub.schedule('every 1 hours').onRun(async (context: any) => {
    await deleteInactiveGames();
    return null;
});


export const helloWorld = functions.region('europe-west1').https.onRequest((req: any, res: any) => {
    res.send("Hello from Firebase!");
});
