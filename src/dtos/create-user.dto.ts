import { IsString, IsEmail, IsNumber, Length } from 'class-validator';
import { min } from 'rxjs';

export class CreateUserDto {
    @IsString()
    nome: string;

    @IsString()
    cognome: string;

    @IsEmail()
    email: string;

    @IsString()
    @Length(8, 15)
    password: string;

    @IsNumber()
    numeroTessera: number;

    @IsString()
    ruolo: string
}