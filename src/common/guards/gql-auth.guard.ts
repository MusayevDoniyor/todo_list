import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const authHeader = gqlContext.req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Unauthorized user');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const verified = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      gqlContext.req.user = verified;

      return true;
    } catch (error) {
      return false;
    }
  }
}
