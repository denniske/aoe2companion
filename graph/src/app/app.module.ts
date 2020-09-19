import {Module} from '@nestjs/common';

import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ScheduleModule} from "@nestjs/schedule";
import {RefetchService} from "./refetch.service";

@Module({
    imports: [
        ScheduleModule.forRoot(),
    ],
    controllers: [
        AppController
    ],
    providers: [
        AppService,
        RefetchService,
    ],
})
export class AppModule {
}
