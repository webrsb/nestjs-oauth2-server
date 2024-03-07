import {
    UseGuards,
    applyDecorators,
    ExecutionContext,
    createParamDecorator,
} from '@nestjs/common';

import { OAuth2ServerAuthorizationGuard } from '../guards';

export const OAuth2Authorize = (): ClassDecorator & MethodDecorator =>
    applyDecorators(
        UseGuards(OAuth2ServerAuthorizationGuard),
    );

export const OAuth2Authorization = createParamDecorator(
    (_: unknown, context: ExecutionContext | any) =>
        context.switchToHttp().getRequest().oauth?.authorization,
);
