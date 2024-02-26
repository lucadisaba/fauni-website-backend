import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UserService } from './user.service';
import { db } from 'src/main';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginResponseDTO } from 'src/dtos/auth-login-response.dto';
import { User } from './user.model';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  userCollection = db.collection('users');

  async signin(email: string, password: string): Promise<AuthLoginResponseDTO> {
    const user = await this.userCollection.where('email', '==', email).get();
    let payload: User;

    if (user.empty) {
      throw new NotFoundException('EMAIL_NOT_FOUND');
    }

    await Promise.all(
      user.docs.map(async (doc) => {
        const [salt, storedHash] = doc.data().password.split('.');

        let hash = (await scrypt(password, salt, 32)) as Buffer;

        if (storedHash !== hash.toString('hex')) {
          throw new BadRequestException('INVALID_PASSWORD');
        }

        payload = {
          id: doc.id,
          name: doc.data().name,
          surname: doc.data().surname,
          email: doc.data().email,
          cardNumber: doc.data().cardNumber,
          role: doc.data().role,
        };
      }),
    );

    return {
      userResponse: payload,
      access_token: this.jwtService.sign(payload),
    };
  }
}
