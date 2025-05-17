import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class UserRegisterDto {
  @ApiProperty({ default: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  name: string;

  @ApiProperty({ default: 'johndoe@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  @Length(3, 100)
  email: string;

  @ApiProperty({ default: 'J0hn_123' })
  @IsNotEmpty()
  @IsStrongPassword()
  @Length(3, 100)
  password: string;
}
