import {createDB} from "./db";
import {PrismaClient} from "@prisma/client";

// Initialize DB with correct entities

async function run() {

    const connection = await createDB();


    const prisma = new PrismaClient();


    const unfinishedMatches = await prisma.match.findMany({
        where: {
            AND: [
                // { maybe_finished: { not: null } },
                // { finished: null },
                { finished: null },
            ],
        },
        orderBy: { finished: 'asc' },
        take: 10,
        include: {
            players: true,
        }
    });

    console.log(unfinishedMatches.length);

    await connection.close();
    await prisma.$disconnect();
}

run();


