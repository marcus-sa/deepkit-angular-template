import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRouting, withAppShell } from '@angular/ssr';

import { AppShellComponent } from './app-shell/app-shell.component';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { provideRpcClient } from './rpc/server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRouting(serverRoutes, withAppShell(AppShellComponent)),
    provideRpcClient(),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
