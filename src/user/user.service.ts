import { Body, Injectable } from '@nestjs/common';
import { getFirestore } from 'firebase-admin/firestore';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { db } from 'src/main';

@Injectable()
export class UserService {

    userCollection = db.collection('utenti');

    async addUser(@Body() createUserDto: CreateUserDto): Promise<any> {
        await this.userCollection.add(createUserDto);
    }
}
