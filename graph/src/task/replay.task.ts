import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {Cron} from "@nestjs/schedule";
import {LeaderboardRow} from "../entity/leaderboard-row";
import {upsertLeaderboardRows} from "../entity/entity-helper";
import {fetchLeaderboardRecentMatches, makeQueryString, setValue} from "../helper";
import {Connection} from "typeorm";
import {IMatch, IMatchBase, IMatchFromApi} from '../entity/entity.type';
import {PrismaService} from '../service/prisma.service';
import fetch from 'node-fetch';
import {IReplayResult} from './replay.type';
import {uniq} from 'lodash';
import {InjectS3, S3} from 'nestjs-s3';

let workerCount = 0;

@Injectable()
export class ReplayTask implements OnModuleInit {
    private readonly logger = new Logger(ReplayTask.name);

    private matches: IMatchFromApi[] = [];
    private pending: string[] = [];

    private apiUrl = 'http://0.0.0.0:80/replay';

    constructor(
        private connection: Connection,
        private prisma: PrismaService,
        @InjectS3() private readonly s3: S3,
    ) {}

    async onModuleInit() {
        this.runIngest1();
        this.runWorker(workerCount++);
        this.runWorker(workerCount++);
        this.runWorker(workerCount++);
        this.runWorker(workerCount++);

        try {
            const list = await this.s3.listBuckets().promise();
            console.log(list.Buckets);
        } catch (e) {
            console.log(e);
        }
    }

    async runWorker(workerNum: number) {
        const match = this.matches.shift();

        if (match == null) {
            setTimeout(() => this.runWorker(workerNum), 1 * 1000);
            return;
        }

        this.pending.push(match.match_id);

        console.log();
        console.log(`WORKER ${workerNum}...`);

        let replayResult: IReplayResult = null;
        for (const player of match.players.filter(p => p.profile_id)) {
            console.time(`WORKER ${workerNum} - ${match.match_id} ${player.profile_id}`);

            console.log(`https://aoe.ms/replay/?gameId=${match.match_id}&profileId=${player.profile_id}`);
            replayResult = await this.processReplay(match.match_id, player.profile_id);
            // console.log('replayResult', replayResult);
            // console.log('replayResult', JSON.stringify(replayResult));

            if (replayResult.replay) break;

            console.timeEnd(`WORKER ${workerNum} - ${match.match_id} ${player.profile_id}`);
        }

        if (replayResult.replay == null) {
            console.log('STATE', replayResult.status);
            await this.prisma.match.update({
                where: {
                    match_id: match.match_id,
                },
                data: {
                    replayed: replayResult.status,
                },
            });
            this.pending.splice(this.pending.indexOf(match.match_id), 1);
            setTimeout(() => this.runWorker(workerNum), 1 * 1000);
            return;
        }

        let unknownWinner = false;
        let shouldUpdateWinner = true;
        let canSafelyUpdateWinner = true;
        for (const replayPlayer of replayResult.replay.players) {
            const existingWinner = match.players.find(p => p.profile_id == replayPlayer.user_id).won;
            if (existingWinner != null && existingWinner != replayPlayer.winner) {
                canSafelyUpdateWinner = false;
            }
            if (existingWinner != null) {
                shouldUpdateWinner = false;
            }
            if (replayPlayer.winner == null) {
                unknownWinner = true;
            }
        }

        let allWinnerSame = uniq(replayResult.replay.players.map(p => p.winner)).length === 1;

        const duration = replayResult.replay.duration;

        let state = 1;

        if (allWinnerSame) {
            console.log('STATE', '1000 - all winner same');
            state = 1000;
        }
        else if (unknownWinner) {
            console.log('STATE', '999 - unknown winner');
            state = 999;
        }
        else if (!canSafelyUpdateWinner) {
            console.log('STATE', '777 - winner mismatch');
            state = 777;
        }
        else if (!shouldUpdateWinner) {
            console.log('STATE', '2 - winner already set');
            state = 2;
        }

        console.log('STATE', state);

        replayResult.replay.players.forEach(v => delete v.achievements);

        const result = await this.s3.putObject({
            Bucket: 'aoe2companion',
            ContentType: 'application/json',
            Key: `parsed-match/${match.match_id}.json`,
            Body: JSON.stringify(replayResult.replay),
            ACL: 'public-read',
        }).promise();

        console.log(result);

        await this.prisma.match.update({
            where: {
                match_id: match.match_id,
            },
            data: {
                duration,
                replayed: state,
            },
        });

        if (state == 1) {
            if (match.players.filter(p => p.profile_id == 0).length > 0) {
                console.log('==> WITH PC', match.match_id);
                console.log('==> WITH PC', match.match_id);
                console.log('==> WITH PC', match.match_id);
                console.log('==> WITH PC', match.match_id);
                console.log('==> WITH PC', match.match_id);
                console.log('==> WITH PC', match.match_id);
                console.log('==> WITH PC', match.match_id);
            }

            for (const replayPlayer of replayResult.replay.players) {
                const existingPlayer = match.players.find(p => p.profile_id == replayPlayer.user_id);
                await this.prisma.player.update({
                    where: {
                        match_id_profile_id_slot: {
                            match_id: match.match_id,
                            profile_id: existingPlayer.profile_id,
                            slot: existingPlayer.slot,
                        },
                    },
                    data: {
                        won: replayPlayer.winner,
                    },
                });
            }
        }

        this.pending.splice(this.pending.indexOf(match.match_id), 1);
        setTimeout(() => this.runWorker(workerNum), 1 * 1000);
    }

    async processReplay(match_id: string, profile_id: number) {
        let query: any = {
            match_id,
            profile_id,
        };
        const queryString = makeQueryString(query);
        const url = `${this.apiUrl}?${queryString}`;
        console.log(url);
        const response = await fetch(url, { timeout: 60 * 1000 });
        try {
            if (response.status == 404) {
                return {
                    status: response.status,
                    replay: null,
                };
            }

            const text = await response.text();
            // console.log(text);
            return {
                status: response.status,
                replay: JSON.parse(text),
            };
            // return await response.json();
        } catch (e) {
            console.log("FAILED", url);
            return {
                status: -1,
                replay: null,
            };
            // throw e;
        }
    }

    async runIngest1() {
        console.log("Running ingest1...");
        console.log("Pending", this.pending);

        if (this.matches.length == 0) {
            // const matches = await this.prisma.match.findMany({
            //     include: {
            //         players: true,
            //     },
            //     where: {
            //         match_id: { in: [
            //                 '41419018',
            //                 // '41318074',
            //                 // '41454851',
            //                 // '41455231',
            //                 // '41455124',
            //                 // '41454557',
            //                 // '41454399',
            //                 // '41454006',
            //                 // '41454251',
            //                 // '41453591',
            //                 // '41453026',
            //             ] },
            //     },
            //     take: 10,
            //     orderBy: {
            //         finished: 'desc',
            //     },
            // }) as any as IMatchFromApi[];
            const matches = await this.prisma.match.findMany({
                include: {
                    players: true,
                },
                where: {
                    finished: {not: null},
                    replayed: null,
                },
                take: 10,
                orderBy: {
                    finished: 'desc',
                },
            }) as any as IMatchFromApi[];
            this.matches = matches.filter(m => !this.pending.includes(m.match_id));
        }

        console.log(this.matches.map(m => m.match_id));

        setTimeout(() => this.runIngest1(), 30 * 1000);
    }
}
