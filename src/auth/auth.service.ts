import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRegisterDto } from './dto/register.dto';
import { UserLoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: UserRegisterDto) {
    const isUserExists = await this.userRepo.findOneBy({ email: dto.email });

    if (isUserExists) {
      throw new ConflictException('This email is already in use.');
    }

    const user = this.userRepo.create(dto);
    await this.userRepo.save(user);

    return {
      message: 'User registered successfully',
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  async login(dto: UserLoginDto) {
    const user = await this.userRepo.findOneBy({ email: dto.email });
    if (!user) {
      throw new UnauthorizedException(
        'User not found with this email, Please register first.',
      );
    }

    const isPasswordMatch = await bcrypt.compare(
      dto.password as string,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid password.');
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '6h',
    });

    return {
      message: 'User logged in successfully',
      user: { id: user.id, name: user.name, email: user.email },
      token,
    };
  }
}
