import {Injectable, Logger} from '@nestjs/common';
import {myTodoList} from "@nex/data/api";
import {Cron} from "@nestjs/schedule";

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Welcome to graph! len:' + myTodoList.length };
  }

  private readonly logger = new Logger(AppService.name);

  @Cron('* * * * * *')
  async handleCron() {
    this.logger.debug('Called when the current second is 1');
  }
}
