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

  async addUser(@Body() input: CreateUserDto): Promise<User> {
    const user = await this.userCollection
      .where('email', '==', input.email)
      .get();

    const numeroTessera = await this.userCollection
      .where('numeroTessera', '==', input.numeroTessera)
      .get();

    if (!user.empty) {
      throw new BadRequestException('email già in uso');
    } else if (!numeroTessera.empty) {
      throw new BadRequestException('numero tessera già in uso');
    } else {
      const salt = randomBytes(8).toString('hex');

      const hash = (await scrypt(input.password, salt, 32)) as Buffer;

      const hashedPassword = salt + '.' + hash.toString('hex');
      const data = {
        nome: input.nome,
        cognome: input.cognome,
        email: input.email,
        password: hashedPassword,
        numeroTessera: input.numeroTessera,
        ruolo: input.ruolo,
      };
      await this.userCollection.add(data);

      return data;
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
      nome: userWithoutPassword.nome,
      cognome: userWithoutPassword.cognome,
      email: userWithoutPassword.email,
      ruolo: userWithoutPassword.ruolo,
      numeroTessera: userWithoutPassword.numeroTessera,
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
      nome: userWithoutPassword.nome,
      cognome: userWithoutPassword.cognome,
      email: userWithoutPassword.email,
      ruolo: userWithoutPassword.ruolo,
      numeroTessera: userWithoutPassword.numeroTessera,
    };
  }

  async delete(id: string) {
    const userDoc = await this.userCollection.doc(id).delete();
  }

  async update(id: string, input: UpdateUserDto) {
    const doc = await this.userCollection.doc(id);

    const existingUserWithTessera = await this.userCollection
      .where('numeroTessera', '==', input.numeroTessera)
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
