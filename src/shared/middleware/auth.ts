import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { decodeAuthToken } from 'src/utility/token-generator';
import { UserRepository } from '../repositories/user.repository';
import { Users } from '../schema/users';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(UserRepository) private readonly userDB: UserRepository,
  ) {}

  async use(req: Request | any, res: Response, next: NextFunction) {
    try {
      const token = req.cookies._digi_auth_token;
      if (!token) {
        throw new UnauthorizedException('Missing auth token');
      }

      const decodedData: any = decodeAuthToken(token);

      const user: Users = await this.userDB.findById(decodedData.id);

      if (!user) {
        throw new UnauthorizedException('Unauthorized');
      }

      user.password = undefined;
      req.user = user;
      next();
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
