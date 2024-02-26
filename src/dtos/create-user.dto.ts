import { IsString, IsEmail, IsNumber, Length } from 'class-validator';
import { min } from 'rxjs';

export class CreateUserDto {
    @IsString()
    name: string;

    @IsString()
    surname: string;

    @IsEmail()
    email: string;

    @IsString()
    @Length(8, 15)
    password: string;

    @IsNumber()
    cardNumber: number;

    @IsString()
    role: string
}