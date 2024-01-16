import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from './role.schema';

export type CatDocument = HydratedDocument<User>;

@Schema() 
export class User {
    @Prop()
    name?: string;

    @Prop()
    surname?: string;

    @Prop({ required: true })
    email!: string;

    @Prop({ required: true })
    password!: string;

    @Prop()
    cardNumber?: number;

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Role', required: true })
    roles: Role[] = [];

}

export const UserSchema = SchemaFactory.createForClass(User);
