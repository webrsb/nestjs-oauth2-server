import { Module, DynamicModule } from '@nestjs/common';
import { TestModelService } from './test-model.service';
import { ExistingModule } from './existing.module';
import { IOAuth2ServerModuleOptions } from '../../lib';
import { TestConfigService } from './test-config.service';
import { OAuth2ServerModule } from '../../lib/oauth2-server.module';

@Module({})
export class TestModule {
    static withForRoot(): DynamicModule {
        return {
            module: TestModule,
            imports: [
                OAuth2ServerModule.forRoot({
                    model: TestModelService,
                }),
            ],
        };
    }

    static withUseFactoryForRootAsync(): DynamicModule {
        return {
            module: TestModule,
            imports: [
                OAuth2ServerModule.forRootAsync({
                    useFactory: (): Omit<
                        IOAuth2ServerModuleOptions,
                        'model'
                    > => ({}),
                    model: TestModelService,
                }),
            ],
        };
    }

    static withUseClassForRootAsync(): DynamicModule {
        return {
            module: TestModule,
            imports: [
                OAuth2ServerModule.forRootAsync({
                    useClass: TestConfigService,
                    model: TestModelService,
                }),
            ],
        };
    }

    static withUseExistingForRootAsync(): DynamicModule {
        return {
            module: TestModule,
            imports: [
                OAuth2ServerModule.forRootAsync({
                    useExisting: TestConfigService,
                    imports: [ExistingModule],
                    model: TestModelService,
                }),
            ],
        };
    }
}
