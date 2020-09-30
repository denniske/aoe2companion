import {DynamicModule, Injectable, Logger, Module, OnModuleInit} from '@nestjs/common';

import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ScheduleModule} from "@nestjs/schedule";
import {RefetchTask} from "../task/refetch.task";
import {ImportTask} from "../task/import.task";
import {IngestTask} from "../task/ingest.task";
import {IngestFastTask} from "../task/ingest-fast.task";
import {NotifyTask} from "../task/notify.task";
import {RatingHistoryTask} from "../task/rating-history.task";
import {RefetchAgainTask} from "../task/refetch-again.task";
import {MetricController} from "../controller/metric.controller";
import {ApiController} from "../controller/api.controller";
import {FunctionController} from "../controller/function.controller";
import {GraphQLModule} from "@nestjs/graphql";
import {MatchResolver} from "../resolver/match";
import {UserResolver} from "../resolver/user";
import {ProfileResolver} from "../resolver/profile";
import {RatingHistoryEntryResolver, RatingHistoryResolver} from "../resolver/rating_history";
import {LeaderboardResolver} from "../resolver/leaderboard";
import {LoggingPlugin} from "../plugin/logging.plugin";
import {environment} from "../environments/environment";
import {RankTask} from "../task/rank.task";
import {PrismaService} from "../service/prisma.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import {Account} from "../entity/account";
import {Push} from "../entity/push";
import {Match} from "../entity/match";
import {Player} from "../entity/player";
import {Following} from "../entity/following";
import {KeyValue} from "../entity/keyvalue";
import {User} from "../entity/user";
import {LeaderboardRow} from "../entity/leaderboard-row";
import {RatingHistory} from "../entity/rating-history";
import {SnakeNamingStrategy} from "typeorm-naming-strategies";
import {Repository} from "typeorm";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "postgres",
            url: process.env.DATABASE_URL,
            entities: [
                Account,
                Push,
                Match,
                Player,
                Following,
                KeyValue,
                User,
                LeaderboardRow,
                RatingHistory,
            ],
            // entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
            synchronize: process.env.LOCAL === 'true',
            logging: false && process.env.LOCAL === 'true',//!!process.env.IS_OFFLINE,
            namingStrategy: new SnakeNamingStrategy(),
        }),
    ],
})
export class CustomTypeOrmModule {}

@Module({
    providers: [
        PrismaService,
    ],
    exports: [
        PrismaService,
    ],
})
export class PrismaModule {
}

@Module({})
export class TaskAndControllerModule {
    static forRoot(): DynamicModule {
        const providers = [];
        const controllers = [];
        console.log('SERVICE_NAME', process.env.SERVICE_NAME);
        switch (process.env.SERVICE_NAME) {
            case 'import':
                providers.push(ImportTask);
                break;
            case 'refetch':
                providers.push(RefetchTask);
                break;
            case 'refetch-again':
                providers.push(RefetchAgainTask);
                break;
            case 'ingest':
                providers.push(IngestTask);
                break;
            case 'ingest-fast':
                providers.push(IngestFastTask);
                break;
            case 'notify':
                providers.push(NotifyTask);
                break;
            case 'rating-history':
                providers.push(RatingHistoryTask);
                break;
            case 'rank':
                providers.push(RankTask);
                break;
            case 'metric':
                controllers.push(MetricController);
                break;
            case 'api':
                controllers.push(ApiController);
                break;
            case 'function':
                controllers.push(FunctionController);
                break;
        }

        console.log('environment', environment.production ? 'prod' : 'dev');
        if (!environment.production) {
            controllers.push(ApiController);
            controllers.push(FunctionController);
        }

        return {
            imports: [
                TypeOrmModule.forFeature([Push]),
                PrismaModule,
            ],
            module: TaskAndControllerModule,
            controllers: controllers,
            providers: providers,
            exports: providers,
        };
    }
}

@Module({})
export class ResolverModule {
    static forRoot(): DynamicModule {
        const providers = [];
        const controllers = [];

        const resolvers = [
            MatchResolver,
            UserResolver,
            ProfileResolver,
            LeaderboardResolver,
            RatingHistoryResolver,
            RatingHistoryEntryResolver,
        ];

        console.log('SERVICE_NAME', process.env.SERVICE_NAME);
        if (process.env.SERVICE_NAME === 'graphql') {
            providers.push(...resolvers);
        }

        console.log('environment', environment.production ? 'prod' : 'dev');
        if (!environment.production) {
            providers.push(...resolvers);
        }

        return {
            imports: [
                CustomTypeOrmModule,
                PrismaModule,
            ],
            module: ResolverModule,
            controllers: controllers,
            providers: providers,
            exports: providers,
        };
    }
}


const fs2json = require('fs-to-json').fs2json;

@Injectable()
export class SchemaJsonTask implements OnModuleInit {
    private readonly logger = new Logger(SchemaJsonTask.name);

    async onModuleInit() {
        await fs2json({input: 'graph/graphql/schema.graphql', output: 'graph/graphql/schema.json'});
        this.logger.log('Created schema.json');
    }
}

@Module({
    imports: [
        ScheduleModule.forRoot(),
        TaskAndControllerModule.forRoot(),
        GraphQLModule.forRoot({
            // tracing: true,
            installSubscriptionHandlers: true,
            autoSchemaFile: 'graph/graphql/schema.graphql',
            sortSchema: true,
            playground: {
                settings: {
                    'schema.polling.enable': false,
                } as any
            }
        }),
        ResolverModule.forRoot(),
    ],
    controllers: [
        // AppController
    ],
    providers: [
        SchemaJsonTask,
        // LoggingPlugin,
    ],
})
export class AppModule {
}
