import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: 'secret123',
        signOptions: {
          expiresIn: '60m',
        },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService, AuthService],
})
export class UserModule {}
