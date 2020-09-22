import {Controller, Get, OnModuleInit, Request, Response} from '@nestjs/common';

import {differenceInMinutes, getUnixTime} from "date-fns";
import {getParam, time} from "../util";
import {Like} from "typeorm";
import {createDB} from "../db";
import {LeaderboardRow} from "../entity/leaderboard-row";
import {getValue} from "../helper";
import {PrismaClient, leaderboard_rowWhereInput} from "@prisma/client";


const prisma = new PrismaClient({
    // log: ['query', 'info', 'warn'],
});

prisma.$use(async (params, next) => {
    const before = Date.now();
    const result = await next(params);
    const after = Date.now();
    console.log(
        `Query ${params.model}.${params.action} took ${after - before}ms`
    );
    return result;
});

const cache: Record<string, number> = {};
let cacheUpdated: Date = null;

interface IRow {
    key: string;
    count: string;
}

async function updateCache() {
    if (cacheUpdated && differenceInMinutes(new Date(), cacheUpdated) < 1) return;
    cacheUpdated = new Date();

    const connection = await createDB();
    console.log('Update cache...');
    const rows: IRow[] = await connection.manager.query('SELECT DISTINCT(leaderboard_id) as key, COUNT(*) FROM leaderboard_row GROUP BY leaderboard_id', []);
    rows.forEach(row => cache[`(${row.key},null)`] = parseInt(row.count));
    const rows2: IRow[] = await connection.manager.query('SELECT DISTINCT(leaderboard_id, country) as key, COUNT(*) FROM leaderboard_row GROUP BY leaderboard_id, country', []);
    rows2.forEach(row => cache[row.key] = parseInt(row.count));
    // console.log('cache', cache);
    console.log('done');
}

@Controller()
export class FunctionController implements OnModuleInit {

    async onModuleInit() {
        await updateCache();
    }

    @Get('/api/leaderboard')
    async leaderboard(
        @Request() req,
        @Response() res,
    ) {
        const connection = await createDB();
        time(1);
        console.log('params:', req.query);

        const start = parseInt(getParam(req.query, 'start') ?? '1');
        const count = parseInt(getParam(req.query, 'count') ?? '10');
        const leaderboardId = parseInt(getParam(req.query, 'leaderboard_id'));
        const country = getParam(req.query, 'country') || null;
        const steamId = getParam(req.query, 'steam_id') || null;
        const profileId = getParam(req.query, 'profile_id') || null;
        const search = getParam(req.query, 'search') || null;

        // console.log('params:', event.queryStringParameters);

        if (
            start < 1 ||
            count > 10000 ||
            ![0, 1, 2, 3, 4].includes(leaderboardId)
        ) {
            res.send({
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Invalid or missing params',
                }, null, 2),
            });
            updateCache();
            return;
        }

        // @ts-ignore
        const leaderboardUpdated = new Date(await getValue('leaderboardUpdated')) || new Date(1970);

        let where: any = {'leaderboard_id': leaderboardId};
        if (country) where['country'] = country;

        time();
        // console.log('TOTAL', where);
        // Execute total before single-result restrictions are appended to where clause
        // const total = await connection.manager.count(LeaderboardRow, {where: where});
        const total = cache[`(${leaderboardId},${country})`] || 0;
        console.log(`cache(${leaderboardId},${country})`, total, cacheUpdated);

        if (steamId) where['steam_id'] = steamId;
        if (profileId) where['profile_id'] = profileId;
        if (search) where['name'] = Like(`%${search}%`);
        // if (search) where['name'] = ILike(`%${search}%`);

        // Only for "My Rank" (will return one row)
        if (country != null && (steamId != null || profileId != null)) {
            console.log('HAS country + id');
            const users = await connection
                .createQueryBuilder()
                .select('*')
                .addSelect(subQuery => {
                    return subQuery
                        .select('count(user.name)', 'rank')
                        .from(LeaderboardRow, "user")
                        .where('user.leaderboard_id = :leaderboardId AND user.country = :country AND user.rating >= outer.rating', {leaderboardId, country});
                })
                .from(LeaderboardRow, "outer")
                .where(where)
                .getRawMany();

            res.send({
                updated: getUnixTime(leaderboardUpdated),
                total: total,
                leaderboard_id: leaderboardId,
                start: start,
                count: count,
                country: country,
                leaderboard: users.map(u => ({...u, rank: parseInt(u.rank)})),
            });
            time();
            updateCache();
            return;
        }

        // Only for "My Rank" (will return one row)
        if (steamId != null || profileId != null) {
            console.log('HAS id');
            const users = await connection
                .createQueryBuilder()
                .select('*')
                .addSelect(subQuery => {
                    return subQuery
                        .select('count(user.name)', 'rank')
                        .from(LeaderboardRow, "user")
                        .where('user.leaderboard_id = :leaderboardId AND user.rating >= outer.rating', {leaderboardId});
                })
                .from(LeaderboardRow, "outer")
                .where(where)
                .getRawMany();

            res.send({
                updated: getUnixTime(leaderboardUpdated),
                total: total,
                leaderboard_id: leaderboardId,
                start: start,
                count: count,
                country: country,
                leaderboard: users.map(u => ({...u, rank: parseInt(u.rank)})),
            });
            time();
            updateCache();
            return;
        }

        console.log('HAS default', where);


        let whereLeaderboardRow: leaderboard_rowWhereInput = {
            'leaderboard_id': leaderboardId
        };
        if (country) {
            whereLeaderboardRow['country'] = country;
        }
        if (search) {
            whereLeaderboardRow['name'] = {
                contains: search,
                mode: "insensitive",
            };
        }

        const users = await prisma.leaderboard_row.findMany({
            where: whereLeaderboardRow,
            skip: start-1,
            take: count,
            orderBy: {
                rating: 'desc',
            },
        });
        // console.log(users);
        time();

        // const users = await connection.createQueryBuilder().from(LeaderboardRow)
        //     .where("name ILIKE '%viper%'")
        //     .where("name ILIKE :search", { search: `${search}` })
        //     .getMany();

        // @ts-ignore
        // const users = await connection.manager.find(LeaderboardRow, {where: where, skip: start-1, take: count, order: { 'rating': 'DESC' }});

        res.send({
            updated: getUnixTime(leaderboardUpdated),
            total: total,
            leaderboard_id: leaderboardId,
            start: start,
            count: count,
            country: country,
            leaderboard: country ? users.map((u, i) => {
                return {...u, rank: u.rank_country};
            }) : users.map((u, i) => {
                return {...u, rank: u.rank}; // start+i
            }),
        });
        time();
        updateCache();
    }
}
