/**
 * Advanced: Task Scheduling
 * 
 * Schedule tasks to run at specific intervals or times.
 */

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class TaskSchedulingService {
  // Cron job - runs every minute
  @Cron(CronExpression.EVERY_MINUTE)
  handleCron() {
    console.log('Task executed every minute');
  }

  // Cron job - runs at specific time
  @Cron('45 * * * * *') // Every 45 seconds
  handleSpecificCron() {
    console.log('Task executed at 45 seconds');
  }

  // Cron job - runs daily at midnight
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleDailyTask() {
    console.log('Daily task executed');
  }

  // Interval - runs every 10 seconds
  @Interval(10000)
  handleInterval() {
    console.log('Task executed every 10 seconds');
  }

  // Timeout - runs once after 5 seconds
  @Timeout(5000)
  handleTimeout() {
    console.log('Task executed after 5 seconds');
  }
}

