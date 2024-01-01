import {
    Module,
    Provider,
    DynamicModule,
    NotImplementedException,
} from '@nestjs/common';
import { ServerOptions } from '@node-oauth/oauth2-server';
import * as OAuth2Server from '@node-oauth/oauth2-server';
import {
    OAuth2ServerTokenGuard,
    OAuth2ServerAuthorizationGuard,
    OAuth2ServerAuthenticationGuard,
} from './guards';
import {
    IOAuth2ServerModuleOptions,
    IOAuth2ServerOptionsFactory,
    IOAuth2ServerModuleAsyncOptions,
} from './interfaces';
import {
    OAUTH2_SERVER,
    OAUTH2_SERVER_MODEL_PROVIDER,
    OAUTH2_SERVER_OPTIONS_TOKEN,
} from './oauth2-server.constants';

@Module({
    providers: [
        {
            provide: OAUTH2_SERVER_OPTIONS_TOKEN,
            useValue: {},
        },
        {
            provide: OAUTH2_SERVER,
            useFactory: (
                options: IOAuth2ServerModuleOptions,
                model: ServerOptions['model'],
            ): OAuth2Server =>
                new OAuth2Server(
                    Object.assign({}, options, { model }),
                ),
            inject: [
                OAUTH2_SERVER_OPTIONS_TOKEN,
                OAUTH2_SERVER_MODEL_PROVIDER,
            ],
        },
        OAuth2ServerTokenGuard,
        OAuth2ServerAuthorizationGuard,
        OAuth2ServerAuthenticationGuard,
    ],
    exports: [OAUTH2_SERVER],
})
export class OAuth2ServerCoreModule {
    static forRoot(
        options: IOAuth2ServerModuleOptions
    ): DynamicModule {
        const { model, ...otherOptions } = options;
        return {
            module: OAuth2ServerCoreModule,
            imports: options.imports || [],
            providers: [
                {
                    provide: OAUTH2_SERVER_OPTIONS_TOKEN,
                    useValue: otherOptions,
                },
                {
                    provide: OAUTH2_SERVER_MODEL_PROVIDER,
                    useClass: model
                },
            ],
        };
    }

    static forRootAsync(
        options: IOAuth2ServerModuleAsyncOptions,
    ): DynamicModule {
        const { model, ...otherOptions } = options;
        return {
            module: OAuth2ServerCoreModule,
            providers: [this.createAsyncProvider(otherOptions), {
                provide: OAUTH2_SERVER_MODEL_PROVIDER,
                useClass: model
            }],
            imports: options.imports || [],
        };
    }

    private static createAsyncProvider(
        options: Omit<IOAuth2ServerModuleAsyncOptions, 'model'>,
    ): Provider {
        if (options.useFactory) {
            return {
                provide: OAUTH2_SERVER_OPTIONS_TOKEN,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }

        const inject = [];
        if (options.useClass) {
            inject.push(options.useClass);
        } else if (options.useExisting) {
            inject.push(options.useExisting);
        } else {
            throw new NotImplementedException(
                'useClass/useExisting is not implemented',
            );
        }
        return {
            provide: OAUTH2_SERVER_OPTIONS_TOKEN,
            useFactory: (factory: IOAuth2ServerOptionsFactory) =>
                factory.createOAuth2ServerOptions(),
            inject,
        };
    }
}
