import { PartialType } from '@nestjs/swagger';
import { UserRegisterDto } from './register.dto';

export class UserLoginDto extends PartialType(UserRegisterDto) {}
