import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Role>;

@Schema()
export class Role {

  @Prop({ required: true })
  description!: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
