import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { db } from 'src/main';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  userCollection = db.collection('utenti');

  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret123',
    });
  }

  async validate(payload: any) {
    const userDoc = await this.userCollection.doc(payload.sub);

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
}
