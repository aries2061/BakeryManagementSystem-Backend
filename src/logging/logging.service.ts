import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DailyLog, LogDocument } from './logging.schema';
import { JsonValue } from '../common/types/json-value.type';

@Injectable()
export class LoggingService {
  constructor(
    @InjectModel(DailyLog.name) private dailyLogModel: Model<LogDocument>,
  ) {}

  async logAction(module: string, action: string, details: JsonValue) {
    const today = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }); // h:m:a format approx (e.g. 3:23 PM)

    const logEntry = {
      timestamp,
      module,
      action,
      details,
    };

    await this.dailyLogModel.findOneAndUpdate(
      { date: today },
      { $push: { logs: logEntry } },
      { upsert: true, new: true },
    );
  }
}
