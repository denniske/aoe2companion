import {DynamicModule, Module} from '@nestjs/common';

import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ScheduleModule} from "@nestjs/schedule";
import {RefetchTask} from "../task/refetch.task";
import {ImportTask} from "../task/import.task";
import {IngestTask} from "../task/ingest.task";


@Module({
    providers: [],
})
export class TaskModule {
    static forRoot(): DynamicModule {
        const providers = [];
        switch (process.env.SERVICE_NAME) {
            case 'import':
                providers.push(ImportTask);
                break;
            case 'refetch':
                providers.push(RefetchTask);
                break;
            case 'ingest':
                providers.push(IngestTask);
                break;
        }
        return {
            module: TaskModule,
            providers: providers,
            exports: providers,
        };
    }
}


@Module({
    imports: [
        ScheduleModule.forRoot(),
        TaskModule.forRoot(),
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




