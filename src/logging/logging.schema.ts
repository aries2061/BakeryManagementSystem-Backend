import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import type { JsonValue } from '../common/types/json-value.type';

export type LogDocument = DailyLog & Document;

@Schema()
export class LogEntry {
  @Prop()
    timestamp!: string;

  @Prop()
    module!: string;

  @Prop()
    action!: string;

  @Prop({ type: Object })
    details!: JsonValue;
}

const LogEntrySchema = SchemaFactory.createForClass(LogEntry);

@Schema()
export class DailyLog {
  @Prop({ required: true, unique: true })
    date!: string;

  @Prop({ type: [LogEntrySchema], default: [] })
    logs!: LogEntry[];
}

export const DailyLogSchema = SchemaFactory.createForClass(DailyLog);
