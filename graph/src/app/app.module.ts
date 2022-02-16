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
import {TypeOrmModule} from '@nestjs/typeorm';
import {Account} from "../entity/account";
import {Push} from "../entity/push";
import {Match} from "../entity/match";
import {Player} from "../entity/player";
import {Following} from "../entity/following";
import {KeyValue} from "../entity/keyvalue";
import {User} from "../entity/user";
import {LeaderboardRow} from "../entity/leaderboard-row";
import {RatingHistory} from "../entity/rating-history";
import {RefetchRepairTask} from '../task/refetch-repair.task';
import {ReplayTask} from '../task/replay.task';
import {S3Module} from 'nestjs-s3';
import {RefetchMultipleTask} from '../task/refetch-multiple.task';
import {RefetchResultTask} from '../task/refetch-result.task';
import {RefetchLateTask} from '../task/refetch-late.task';
import {PlayerResolver} from "../resolver/player";
import {ImportOngoingTask} from "../task/import-ongoing.task";
import {RestController} from "../controller/rest.controller";
import {SnakeNamingStrategy} from "../plugin/snake-naming.strategy";

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
export class CustomTypeOrmModule {
}

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

@Module({
    imports: [
        S3Module.forRoot({
            config: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
                // endpoint: process.env.S3_ENDPOINT,
                s3ForcePathStyle: true,
                signatureVersion: 'v4',
            },
        }),
    ],
    providers: [
        // PrismaService,
    ],
    exports: [
        // PrismaService,
    ],
})
export class CustomS3Module {
}

@Module({})
export class TaskAndControllerModule {
    static forRoot(): DynamicModule {
        const providers = [];
        const controllers = [];
        console.log('SERVICE_NAME', process.env.SERVICE_NAME);
        if (process.env.SERVICE_NAME?.endsWith('import')) {
            providers.push(ImportTask);
        }
        if (process.env.SERVICE_NAME?.endsWith('import-ongoing')) {
            providers.push(ImportOngoingTask);
        }
        if (process.env.SERVICE_NAME?.endsWith('refetch')) {
            providers.push(RefetchTask);
        }
        if (process.env.SERVICE_NAME?.endsWith('refetch-multiple')) {
            // providers.push(RefetchAgainTask);
            // providers.push(RefetchTask);
            // providers.push(ImportTask);
            providers.push(RefetchMultipleTask);
        }
        if (process.env.SERVICE_NAME?.endsWith('refetch-late')) {
            providers.push(RefetchLateTask);
        }
        if (process.env.SERVICE_NAME?.endsWith('refetch-again')) {
            providers.push(RefetchAgainTask);
        }
        if (process.env.SERVICE_NAME?.endsWith('refetch-result')) {
            providers.push(RefetchResultTask);
        }
        if (process.env.SERVICE_NAME?.endsWith('refetch-repair')) {
            providers.push(RefetchRepairTask);
        }
        if (process.env.SERVICE_NAME?.endsWith('replay')) {
            providers.push(ReplayTask);
        }
        if (process.env.SERVICE_NAME?.endsWith('ingest')) {
            providers.push(IngestTask);
        }
        if (process.env.SERVICE_NAME?.endsWith('ingest-fast')) {
            providers.push(IngestFastTask);
        }
        if (process.env.SERVICE_NAME?.endsWith('notify')) {
            providers.push(NotifyTask);
        }
        if (process.env.SERVICE_NAME?.endsWith('rating-history')) {
            providers.push(RatingHistoryTask);
        }
        if (process.env.SERVICE_NAME?.endsWith('rank')) {
            providers.push(RankTask);
        }
        if (process.env.SERVICE_NAME?.endsWith('metric')) {
            controllers.push(MetricController);
        }
        if (process.env.SERVICE_NAME?.endsWith('api')) {
            controllers.push(ApiController);
        }
        if (process.env.SERVICE_NAME?.endsWith('function')) {
            controllers.push(FunctionController);
        }
        if (process.env.SERVICE_NAME?.endsWith('rest')) {
            controllers.push(RestController);
        }

        console.log('environment', process.env.ENVIRONMENT);
        if (process.env.ENVIRONMENT === 'development') {
            controllers.push(ApiController);
            // controllers.push(FunctionController);
        }

        return {
            imports: [
                TypeOrmModule.forFeature([Push]),
                PrismaModule,
                CustomS3Module,
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

        const imports: any[] = [
            CustomTypeOrmModule,
            PrismaModule,
        ];

        const graphqlModule = GraphQLModule.forRoot({
            // tracing: true,
            installSubscriptionHandlers: true,
            autoSchemaFile: 'graph/graphql/schema.graphql',
            sortSchema: true,
            playground: {
                settings: {
                    'schema.polling.enable': false,
                } as any
            }
        });

        const resolvers = [
            PlayerResolver,
            MatchResolver,
            UserResolver,
            ProfileResolver,
            LeaderboardResolver,
            RatingHistoryResolver,
            RatingHistoryEntryResolver,
        ];

        console.log('SERVICE_NAME', process.env.SERVICE_NAME);
        if (process.env.SERVICE_NAME?.endsWith('graphql')) {
            imports.push(graphqlModule);
            providers.push(...resolvers);
        }

        console.log('environment', process.env.ENVIRONMENT);
        if (process.env.ENVIRONMENT === 'development') {
            imports.push(graphqlModule);
            providers.push(...resolvers);
        }

        return {
            imports: imports,
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
