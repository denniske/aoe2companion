import {DynamicModule, Module} from '@nestjs/common';

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


@Module({
    providers: [],
})
export class TaskAndControllerModule {
    static forRoot(): DynamicModule {
        const providers = [];
        const controllers = [];
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
        return {
            module: TaskAndControllerModule,
            controllers: controllers,
            providers: providers,
            exports: providers,
        };
    }
}


@Module({
    imports: [
        ScheduleModule.forRoot(),
        TaskAndControllerModule.forRoot(),
    ],
    controllers: [
        // AppController
    ],
    providers: [
        // AppService,
    ],
})
export class AppModule {
}




