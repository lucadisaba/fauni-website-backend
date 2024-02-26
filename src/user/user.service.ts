import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { getFirestore } from 'firebase-admin/firestore';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { db } from 'src/main';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { User } from './user.model';
import { UpdateUserDto } from 'src/dtos/update-user.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class UserService {
  userCollection = db.collection('utenti');

  async addUser(@Body() input: CreateUserDto): Promise<string> {
    const user = await this.userCollection
      .where('email', '==', input.email)
      .get();

    const cardNumber = await this.userCollection
      .where('cardNumber', '==', input.cardNumber)
      .get();

    if (!user.empty) {
      throw new BadRequestException('email già in uso');
    } else if (!cardNumber.empty) {
      throw new BadRequestException('numero tessera già in uso');
    } else {
      const salt = randomBytes(8).toString('hex');

      const hash = (await scrypt(input.password, salt, 32)) as Buffer;

      const hashedPassword = salt + '.' + hash.toString('hex');
      const data = {
        name: input.name,
        surname: input.surname,
        email: input.email,
        password: hashedPassword,
        cardNumber: input.cardNumber,
        role: input.role,
      };
      await this.userCollection.add(data);

      return `Utente ${data.name} ${data.surname} inserito correttamente`; 
    }
  }

  async getAllUsers(): Promise<User[]> {
    const usersData = await this.userCollection.get();

    const users = [];

    usersData.forEach((doc) => {
      const userData = doc.data();

      const userId = doc.id;

      const { password, ...userWithoutPassword } = userData;

      const user = {
        id: userId,
        ...userWithoutPassword,
      };

      users.push(user);
    });

    return users;
  }

  async getUserById(id: string): Promise<User> {
    const userDoc = await this.userCollection.doc(id);

    const user = (await userDoc.get()).data();

    const { password, ...userWithoutPassword } = user;

    return {
      name: userWithoutPassword.name,
      surname: userWithoutPassword.surname,
      email: userWithoutPassword.email,
      role: userWithoutPassword.role,
      cardNumber: userWithoutPassword.cardNumber,
    };
  }

  async whoami(id: string) {
    if (!id) {
      return null;
    }
    const userDoc = await this.userCollection.doc(id);

    const user = (await userDoc.get()).data();

    const { password, ...userWithoutPassword } = user;

    return {
      name: userWithoutPassword.name,
      surname: userWithoutPassword.surname,
      email: userWithoutPassword.email,
      role: userWithoutPassword.role,
      cardNumber: userWithoutPassword.cardNumber,
    };
  }

  async delete(id: string) {
    const userDoc = await this.userCollection.doc(id).delete();
  }

  async update(id: string, input: UpdateUserDto) {
    const doc = await this.userCollection.doc(id);

    const existingUserWithTessera = await this.userCollection
      .where('cardNumber', '==', input.cardNumber)
      .get();
    const existingUserWithEmail = await this.userCollection
      .where('email', '==', input.email)
      .get();

    existingUserWithTessera.forEach((doc) => {
      if (doc.id !== id) {
        throw new BadRequestException(
          'Numero di tessera già in uso da un altro utente.',
        );
      }
    });

    existingUserWithEmail.forEach((doc) => {
      if (doc.id !== id) {
        throw new BadRequestException('Email già in uso da un altro utente.');
      }
    });

    if (input.password) {
      const salt = randomBytes(8).toString('hex');

      const hash = (await scrypt(input.password, salt, 32)) as Buffer;

      const hashedPassword = salt + '.' + hash.toString('hex');

      input.password = hashedPassword;
    }
    const res = await doc.set(input, { merge: true });
    return res;
  }
}
