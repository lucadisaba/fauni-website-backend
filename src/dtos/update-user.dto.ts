import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  name?: string;

  @IsString()
  surname?: string;

  @IsEmail()
  email?: string;

  @IsString()
  @Length(8, 15)
  @IsOptional()
  password?: string;

  @IsNumber()
  cardNumber?: number;

  @IsString()
  role?: string;
}
