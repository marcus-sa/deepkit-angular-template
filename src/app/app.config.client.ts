import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';

import { environment } from '../environments/environment';
import { appConfig } from './app.config';
import { provideRpcClient } from './rpc/client';

const clientConfig: ApplicationConfig = {
  providers: [provideRpcClient(environment.rpc.url)],
};

export const config = mergeApplicationConfig(appConfig, clientConfig);
