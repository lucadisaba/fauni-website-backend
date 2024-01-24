import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UserService } from './user.service';
import { db } from 'src/main';
import { User } from './user.model';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  userCollection = db.collection('utenti');

  async signin(email: string, password: string): Promise<User> {
    const user = await this.userCollection.where('email', '==', email).get();

    if (!user) {
      throw new NotFoundException('EMAIL_NOT_FOUND');
    }

    const promises = user.docs.map(async (doc) => {
      const [salt, storedHash] = doc.data().password.split('.');

      const hash = (await scrypt(password, salt, 32)) as Buffer;

      if (storedHash !== hash.toString('hex')) {
        throw new BadRequestException('INVALID_PASSWORD');
      }

      return {
        id: doc.id,
        nome: doc.data().nome,
        cognome: doc.data().cognome,
        email: doc.data().email,
        numeroTessera: doc.data().numeroTessera,
        ruolo: doc.data().ruolo,
      };
    });

    const users = await Promise.all(promises);
    return users[0];
  }
}
