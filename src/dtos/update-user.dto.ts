import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  nome?: string;

  @IsString()
  cognome?: string;

  @IsEmail()
  email?: string;

  @IsString()
  @Length(8, 15)
  @IsOptional()
  password?: string;

  @IsNumber()
  numeroTessera?: number;

  @IsString()
  ruolo?: string;
}
