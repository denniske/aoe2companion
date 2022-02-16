import {Controller, Get, OnModuleInit, Request, Response} from '@nestjs/common';
import {differenceInMinutes, getUnixTime} from "date-fns";
import {getParam, time} from "../util";
import {getValue} from "../helper";
import {Connection} from "typeorm";
import {PrismaService} from "../service/prisma.service";


let cache: Record<string, number> = {};
let cacheUpdated: Date = null;

interface IRow {
    key: string;
    count: string;
}


@Controller()
export class RestController implements OnModuleInit {

    constructor(
        private connection: Connection,
        private prisma: PrismaService
    ) {}

    async onModuleInit() {

    }

    @Get('/api/matches')
    async matches(
        @Request() req,
        @Response() res,
    ) {
        time(1);
        console.log('params:', req.query);

        const cursor = getParam(req.query, 'cursor') ?? '0';
        const count = parseInt(getParam(req.query, 'count') ?? '10');

        console.log({
            cursor,
            count,
        });

        if (
            count < 1 ||
            count > 10000
        ) {
            res.send({
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Invalid or missing params (valid count 1..10000)',
                }, null, 2),
            });
            return;
        }

        time();

        const matches = await this.prisma.match.findMany({
            include: {
                players: true,
            },
            where: {
                match_id: { gt: cursor },
            },
            take: count,
            orderBy: {
                match_id: 'asc',
            },
        });
        time();

        res.send({
            next_cursor: matches.length < count ? null : matches[matches.length - 1].match_id,
            matches,
        });
        time();
    }
}
