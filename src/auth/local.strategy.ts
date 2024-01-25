import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { db } from 'src/main';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }
  private readonly logger = new Logger(LocalStrategy.name);
  userCollection = db.collection('utenti');
  public async validate(email: string, password: string): Promise<any> {
    const user = await this.userCollection.where('email', '==', email).get();

    if (user.empty) {
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
