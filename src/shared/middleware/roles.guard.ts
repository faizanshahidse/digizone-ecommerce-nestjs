import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { userTypes } from '../schema/users';
import { Roles, ROLES_KEY } from './role.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<userTypes[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    /**
     * Returns the type of the controller class which the current handler belongs to.
     */
    // getClass<T>(): Type<T>;
    /**
     * Returns a reference to the handler (method) that will be invoked next in the
     * request pipeline.
     */
    // getHandler(): Function;

    // const requiredRoles = this.reflector.get<userTypes[]>(
    //   ROLES_KEY,
    //   context.getHandler(),
    // );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.type?.includes(role));
  }
}
