import {
    AuthorizeOptions,
    AuthorizationCode,
    Request as OAuth2Request,
    Response as OAuth2Response,
} from '@node-oauth/oauth2-server';
import { from, Observable } from 'rxjs';
import { Injectable, CanActivate, Inject } from '@nestjs/common';

import { BaseGuard } from './base.guard';
import { AUTHENTIACATE_HANDLER } from '../oauth2-server.constants';

@Injectable()
export class OAuth2ServerAuthorizationGuard
    extends BaseGuard
    implements CanActivate
{
    @Inject(AUTHENTIACATE_HANDLER) protected readonly authenticateHandler!: AuthorizeOptions;

    protected action(
        request: OAuth2Request,
        response: OAuth2Response
    ): Observable<AuthorizationCode> {
        return from(this.oauthServer.authorize(request, response, this.authenticateHandler));
    }

    protected includeOauthInRequest(
        request: Record<string, any>,
        authorization: AuthorizationCode,
    ) {
        request.oauth = { authorization };
    }
}
