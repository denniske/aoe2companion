import {createConnection, getConnectionManager} from "typeorm";
import {User} from "../entity/user";

export async function createDB() {
    try {
        const connection  = await  createConnection({
            type: "postgres",
            url: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false,
            },
            entities: [
                User,
            ],
            // entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
            synchronize: true,
            logging: false
        });
        return connection;
    } catch (err) {
        // If AlreadyHasActiveConnectionError occurs, return already existing connection
        if (err.name === "AlreadyHasActiveConnectionError") {
            const existingConnection = getConnectionManager().get("default");
            console.log('Using existing connection. Connected: ', existingConnection.isConnected);
            console.log('Using existing connection. Connected: ', existingConnection.entityMetadatas);

            return existingConnection;
        }
    }
}