import { Type } from '@nestjs/common';
import { BaseModel, ServerOptions } from '@node-oauth/oauth2-server';
import { Abstract, ModuleMetadata } from '@nestjs/common/interfaces';

export interface IOAuth2ServerModuleOptions
    extends Omit<ServerOptions, 'model'>,
        Pick<ModuleMetadata, 'imports'> {
    model: Type<BaseModel>;
}

export interface IOAuth2ServerOptionsFactory {
    createOAuth2ServerOptions(): Omit<IOAuth2ServerModuleOptions, 'model'>;
}

export interface IOAuth2ServerModuleAsyncOptions
    extends Pick<ModuleMetadata, 'imports'> {
    model: Type<BaseModel>;
    useClass?: Type<IOAuth2ServerOptionsFactory>;
    useExisting?: Type<IOAuth2ServerOptionsFactory>;
    useFactory?: (...args: any[]) => Omit<IOAuth2ServerModuleOptions, 'model'>;
    inject?: Array<
        // eslint-disable-next-line @typescript-eslint/ban-types
        Type<any> | string | symbol | Abstract<any> | Function
    >;
}
