import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LeadershipTeamDocument = LeadershipTeam & Document;

@Schema({ timestamps: true })
export class LeadershipTeam {
  @Prop({ required: true })
  designation: string;

  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  member_id: Types.ObjectId;
}

export const LeadershipTeamSchema = SchemaFactory.createForClass(LeadershipTeam);
