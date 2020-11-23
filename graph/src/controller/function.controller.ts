import {Controller, Get, OnModuleInit, Request, Response} from '@nestjs/common';
import {differenceInMinutes, getUnixTime} from "date-fns";
import {getParam, time} from "../util";
import {getValue} from "../helper";
import {Connection} from "typeorm";
import {PrismaService} from "../service/prisma.service";


const cache: Record<string, number> = {};
let cacheUpdated: Date = null;

interface IRow {
    key: string;
    count: string;
}


@Controller()
export class FunctionController implements OnModuleInit {

    constructor(
        private connection: Connection,
        private prisma: PrismaService
    ) {}

    async onModuleInit() {
        await this.updateCache();
    }

    async updateCache() {
        if (cacheUpdated && differenceInMinutes(new Date(), cacheUpdated) < 1) return;
        cacheUpdated = new Date();

        console.log('Update cache...');
        const rows: IRow[] = await this.connection.manager.query('SELECT DISTINCT(leaderboard_id) as key, COUNT(*) FROM leaderboard_row GROUP BY leaderboard_id', []);
        rows.forEach(row => cache[`(${row.key},null)`] = parseInt(row.count));
        const rows2: IRow[] = await this.connection.manager.query('SELECT DISTINCT(leaderboard_id, country) as key, COUNT(*) FROM leaderboard_row GROUP BY leaderboard_id, country', []);
        rows2.forEach(row => cache[row.key] = parseInt(row.count));
        // console.log('cache', cache);
        console.log('done');
    }

    @Get('/api/write')
    async write(
        @Request() req,
        @Response() res,
    ) {
        console.log(req.query.name);
        console.log(req.query.value);
        res.send({
            done: true
        });
    }

    @Get('/api/leaderboard')
    async leaderboard(
        @Request() req,
        @Response() res,
    ) {
        time(1);
        console.log('params:', req.query);

        const start = parseInt(getParam(req.query, 'start') ?? '1');
        const count = parseInt(getParam(req.query, 'count') ?? '10');
        const leaderboardId = parseInt(getParam(req.query, 'leaderboard_id'));
        const country = getParam(req.query, 'country') || null;
        const steamId = getParam(req.query, 'steam_id') || null;
        const profileId = parseInt(getParam(req.query, 'profile_id')) || null;
        const search = getParam(req.query, 'search') || null;

        console.log({
            start,
            count,
            leaderboardId,
            country,
            steamId,
            profileId,
            search,
        });

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
            this.updateCache();
            return;
        }

        // @ts-ignore
        const leaderboardUpdated = new Date(await getValue(this.connection, 'leaderboardUpdated')) || new Date(1970);

        time();

        const total = cache[`(${leaderboardId},${country})`] || 0;
        console.log(`cache(${leaderboardId},${country})`, total, cacheUpdated);

        // Only for "My Rank" (will return one row)
        if (steamId != null || profileId != null) {
            console.log('HAS id');

            const users = await this.prisma.leaderboard_row.findMany({
                where: {
                    leaderboard_id: leaderboardId,
                    ...(country && { country }),
                    ...(profileId && { profile_id: profileId }),
                    ...(steamId && { steam_id: steamId }),
                },
            });

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
            this.updateCache();
            return;
        }

        console.log('HAS default');

        const users = await this.prisma.leaderboard_row.findMany({
            where: {
                leaderboard_id: leaderboardId,
                ...(country && { country }),
                ...(search && { name: { contains: search, mode: "insensitive" } }),
            },
            skip: start-1,
            take: count,
            orderBy: {
                rating: 'desc',
            },
        });
        time();

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
        this.updateCache();
    }
}
