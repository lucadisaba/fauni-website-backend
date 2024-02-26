import { IsEmail, IsString } from 'class-validator';

/**
 * A DTO representing a login user.
 */
export class UserLoginDTO {
  @IsString()
  readonly password: string;

  @IsEmail()
  readonly email: string;
}
