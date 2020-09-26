import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    constructor() {
        super({
            log: ['query', 'info', 'warn'],
        });
    }

    async onModuleInit() {
        this.$use(async (params, next) => {
            const before = Date.now();
            const result = await next(params);
            const after = Date.now();
            console.log(
                `Query ${params.model}.${params.action} took ${after - before}ms`
            );
            return result;
        });

        // (prisma.$on as any)('query', (e: any) => {
        //     e.timestamp;
        //     e.query;
        //     e.params;
        //     e.duration;
        //     e.target;
        //     console.log(e);
        // });

        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}